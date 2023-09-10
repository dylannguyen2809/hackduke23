# Calendula
Latham and Dylan's HackDuke 2023 project!

## Inspiration
Both of our team members are chronic procrastinators, partly due to our lack of time management skills. We created Calendula so that the heard part of time management is already done for us, so that we can do work more efficiently and have more time for things we enjoy.

## What it does
Calendula works by taking the user’s existing schedule, what tasks they would like to work on, and how many hours they wish to spend on each task, and it creates a new schedule for them that accommodates all of their requirements. It allows the user to view their entire week in advance and does the hard part of time management for them. All that’s left for the user is to follow the schedule!

## How we built it
To make this project, we used a Flask backend and a React frontend to make sure that we were able to carry out the necessary processing on the calendar data files. We made particular use of the python icalendar library, which helped with navigating the very complex .ics data format and arranging events on the calendar. 

## Challenges we ran into
The .ics files were very challenging to work with, on account of them being so large and so difficult to interpret. A lot of the libraries we used were, despite easing the process of working with the file, still relatively clunky and awkward to use. Moreover, .ics files are not sorted by date, but rather by the date in whcih events were added, and did not explicitly repeat recurring events, which made it difficult to identify blocks of free time.

Additionally, there were some frustrations with using React, specifically around the whole file handling pipeline. Having to not only take in an uploaded file, but pass it to the backend to recieve another file back made things pretty complicated for us! But we're proud that we were able to overcome these setbacks.

## Accomplishments that we're proud of
The key piece of the project is the scheduling algorithm, which takes into account the user's calendar, how many tasks they want to schedule, and which block of time they were willing to work in. Once it knows this information, the algorithm identifies blocks of free time and uses a priority queue based greedy algorithm to assign tasks to those blocks of free time, making sure to account for the user's desired work hours. This took a lot of work to implement, but we're very proud that it works!

## What we learned
Throughout the development of Calendula, we gained valuable experience in working with complex data formats like .ics files and the challenges they present. We also honed our skills in web development, particularly with Flask and React, learning how to integrate both back-end and front-end components seamlessly. Additionally, we deepened our understanding of scheduling algorithms and UX/UI design principles, which will be valuable in future projects.

## What's next for Calendula
In the future, we envision expanding Calendula’s capabilities. We aim to enhance the user interface, making it even more intuitive and user-friendly. Additionally, we'll explore the possibility of integrating with popular calendar applications to streamline the user experience. Ultimately, our goal is to help individuals become more efficient and effective in managing their time, further reducing the stress of procrastination and enhancing productivity.
