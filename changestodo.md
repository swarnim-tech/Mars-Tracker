# Changes to make

- [ ] Make Sun and its reflection on mars better so that it will actually follow mars roataion and angle etc.
- [ ] Make mars rotate (wrt to earth time)
- [ ] Make satellite orbits and trajectories better looking and update in real time (The more you zoom in the more you can see the objects moving)
- [ ] Create documentaion and update readme files. Make github better
- [ ] Add more categories for sidebar for categories like country, mission type etc
- [ ] Add collision warning section in bottom half of sidebar [if software thinks there will be collisions based on orbital paths] which will maintain a table of possible collisions and deorbits as the number of satellites expand.
- [ ] if someone clicks on a satellite, it will move the cetre of focus to that satellite and create a descrption box that is connected to the satelellite dot. the box will show information such as mission data, country of origin, launch date etc. it will also highlight the satellite in side bar. if user clicks recentre button, camera will recentre to the mars planet.
- [ ] need to expand so that it can hold info of all satellies in orbit (active or defunct) , currently there are 7 satellites in orbit but only 4 artificial satellites are present.
- [ ] need to add a history timeline that is a button. once clicked it will open history mode and user can scroll a slider or enter a date to see satelites number andorbits over time. the layout and sidebar logic will stay the same, and once user exits the history mode then it will revert to original program.

- [ ] need to study more on the API that nasa and others provide for information, i wnat to see if i can develop a two fold system where one side maintains gravitational data and other side takes telemetry from incoming satellites and converts it to create current orbital paths aswell as future paths, so that there can be real time animation of satellites even if the data is not coming consistently.