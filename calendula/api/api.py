import json
from icalendar import Calendar, Event
import recurring_ical_events
from datetime import datetime, timedelta, date, time
from flask import Flask, request, jsonify, make_response
import tempfile, os
from pathlib import Path

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': 'hi'}

@app.route('/freetime')
def freetime():
    start_date = (2023, 8, 31)
    end_date =   (2023, 9, 2)
    path_to_ics_file = "./data/dylannguyen289@gmail.com.ics"
    times = []
    #open file
    with open(path_to_ics_file) as f:
        calendar = Calendar.from_ical(f.read())

    #read ical, get events
    events = recurring_ical_events.of(calendar, components=["VEVENT"]).between(start_date, end_date)
    for event in events:
        start = event["DTSTART"].dt
        duration = event["DTEND"].dt - event["DTSTART"].dt
        times.append({"start": start, "duration": duration})
    
    #loop through, make array of free slots
    free_time = []
    for i in range(len(times)-1):
        duration = times[i+1]["start"] - (times[i]["start"] + times[i]["duration"])
        start = times[i]["start"] + times[i]["duration"]
        if duration > datetime.timedelta(0): #no overlapping events. TODO: Change to account for time prefs
            free_time.append("start {} duration {}".format(start, duration))
            #free_time.append({"start": start, "duration": duration})

    return{'freetime': free_time}

@app.route('/upload', methods = ['POST'])
def upload_file():
    file = request.data
    print(file)
    return "done"

@app.route('/schedule', methods = ['POST'])
def schedule():
    cal = request.files['file']
    exclude = json.loads(request.form['exclude'])
    tasks = json.loads(request.form['tasks'])
    start_date = json.loads(request.form['startDate'])
    end_date = json.loads(request.form['endDate'])
    times = []

    for task in tasks:
        task['duration'] = int(task['duration'])
    print(exclude)
    print(tasks)
    print(start_date)
    print(end_date)
    print(times)

    #open file
    calstr = cal.read()
    calendar = Calendar.from_ical(calstr)

    #read ical, get events
    
    events = recurring_ical_events.of(calendar, components=["VEVENT"]).between(
        (start_date['year'], start_date['month'], start_date['day']),
        (end_date['year'], end_date['month'], end_date['day']))
    for event in events:
        start = event["DTSTART"].dt
        duration = event["DTEND"].dt - event["DTSTART"].dt
        times.append({"start": start, "duration": duration})
    
    for t in times:
        print(t['start'], t['duration'])
    times = sorted(times, key=lambda x: x['start'])

    #loop through, make array of free slots
    free_time = []
    for i in range(len(times)-1):
        sleep_start = (int(exclude['start'][0:2]), int(exclude['start'][3:5]))
        sleep_end = (int(exclude['end'][0:2]), int(exclude['end'][3:5]))

        duration = times[i+1]["start"] - (times[i]["start"] + times[i]["duration"])
        start = times[i]["start"] + times[i]["duration"]
        
        if (duration > timedelta(0)):
            if times[i]["start"].date() < times[i+1]["start"].date():
                free_time.append({"start": times[i]["start"] + times[i]["duration"], "duration": times[i]["start"].replace(hour=sleep_start[0], minute=sleep_start[1]) - (times[i]["start"] + times[i]["duration"])})
                free_time.append({"start": times[i+1]["start"].replace(hour=sleep_end[0], minute=sleep_end[1]), "duration": (start+duration) - times[i+1]["start"].replace(hour=sleep_end[0], minute=sleep_end[1])})
            else:
                free_time.append({"start": start, "duration": duration})

    print("free times")
    for t in free_time:
        print(t['start'], t['duration'])

    #loop through tasks, assign. use as queue
    total_free_time = timedelta(0)
    for t in free_time:
        total_free_time += t['duration']
    task_sum = timedelta(0) #if sum of task times > time available, don't assign
    for task in tasks:
        task['duration'] = int(task['duration'])
        task_sum += timedelta(hours=task['duration'])
    if task_sum < total_free_time: # has enough time
        task_queue = list(reversed(tasks))
        availableTime = free_time[0]['duration']
        i = 0
        while(len(task_queue) > 0) and (i < len(free_time)-1):
            print(task_queue)
            currentTask = task_queue.pop()
            taskTime = timedelta(hours=currentTask['duration'])
            if availableTime > timedelta(hours=1, minutes=14):
                print('in here')
                if availableTime > (taskTime + timedelta(minutes=14)):
                    print('more time', currentTask['name'])
                    add_event(calendar=calendar, start=free_time[i]['start'] + timedelta(minutes=15),
                        end=free_time[i]['start'] +timedelta(minutes=15)+taskTime, summary=currentTask['name'])
                    availableTime -= taskTime
                    free_time.insert(i+1, {"start": free_time[i]['start'] +timedelta(minutes=15)+taskTime,"duration": availableTime})
                elif availableTime >= timedelta(hours=1, minutes=14):
                    print('enough time', currentTask['name'])
                    add_event(calendar=calendar, start=free_time[i]['start'] + timedelta(minutes=15),
                        end=free_time[i]['start']+availableTime, summary=currentTask['name'])
                    task_queue.insert(0, {"name": currentTask["name"], "duration": currentTask['duration']- availableTime.total_seconds()/3600})
                    availableTime = timedelta(0)
                #else:
                #    task_queue.insert(0, {"name": currentTask["name"], "duration": currentTask['duration']})
            else:
                print('no time', currentTask['name'])
                task_queue.append({"name": currentTask["name"], "duration": currentTask['duration']})
                availableTime = free_time[i+1]['duration']
            i+=1
    else:
        print('not enough time')
    #  turn calendar data into a response
    response = make_response(calendar.to_ical())
    response.headers["Content-Disposition"] = "attachment; filename=calendar.ics"
    return response

def isNowInTimePeriod(startTime, endTime, nowTime):
    if startTime < endTime: 
        return nowTime >= startTime and nowTime <= endTime 
    else: 
        #Over midnight: 
        return nowTime >= startTime or nowTime <= endTime
    
def add_event(calendar, start, end, summary):
    event = Event()
    event.add('uid', str(summary + str(start)))
    event.add('summary', summary)
    event.add('dtstart', start)
    event.add('dtend', end)
    calendar.add_component(event)


'''
    #Add in times, excluding 
    for time_block in exclude:
        event = Event()
        event.add('uid', time_block['start'])
        event.add('summary', "EXCLUDE")
        event.add('dtstart', datetime(start_date['year'], start_date['month'], start_date['day']) + timedelta(hours=int(time_block['start'][0:2]), minutes=int(time_block['start'][3:5])))
        event.add('dtend', datetime(start_date['year'], start_date['month'], start_date['day']) + timedelta(hours=int(time_block['end'][0:2]), minutes=int(time_block['end'][3:5])))
        event.add('rrule', {'freq': 'daily', 'until': datetime(end_date['year'], end_date['month'], end_date['day'])})
        calendar.add_component(event)
'''