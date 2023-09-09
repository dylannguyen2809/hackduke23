import json
from icalendar import Calendar, Event
import recurring_ical_events
from datetime import datetime, timedelta, date, time
from flask import Flask, request, jsonify

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
    
    
    #loop through, make array of free slots
    free_time = []
    for i in range(len(times)-1):
        #if times[]
        duration = times[i+1]["start"] - (times[i]["start"] + times[i]["duration"])
        start = times[i]["start"] + times[i]["duration"]
        sleep_start = (int(exclude['start'][0:2]), int(exclude['start'][3:5]))
        sleep_end = (int(exclude['end'][0:2]), int(exclude['end'][3:5]))
        if ((duration > timedelta(0)) and 
            (not isNowInTimePeriod(time(sleep_start[0], sleep_start[1]), time(sleep_end[0], sleep_end[1]), (start + duration).time()))): #no overlapping events. TODO: Change to account for time prefs
            free_time.append("start {} duration {}".format(start, duration))
            #free_time.append({"start": start, "duration": duration})

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
    print(free_time) 


    return{'schedule': "exclude {} tasks {} start_date {} end_date {}".format(exclude, tasks, start_date, end_date)}

def isNowInTimePeriod(startTime, endTime, nowTime):
    if startTime < endTime: 
        return nowTime >= startTime and nowTime <= endTime 
    else: 
        #Over midnight: 
        return nowTime >= startTime or nowTime <= endTime 