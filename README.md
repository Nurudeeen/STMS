# STMS
This project entails the development of a smart public transportation system using Google Distance Matrix API.
the app gives the user infromation on the expectetd time of arrival (ETA) and the distance that remains for the bus to get to the destination.
In this example, the destination is already fixed inthe backend in the form of a json object containing the longitude and latitude of the location.
The system has also been extended in functionalities by adding an IOT based hardware that queries and get the information to display to the commuters.
The system has also been tested in real-life scenarios and perfomed exceptionally.
In the nearest future we want to be able to implement the following:
1. Addition of a Google Place API so that users may key in their location data without the need to add a longitude and latitude
2. Addition of a queuing functionality so that the system can deal with multiple requests from diffent buses arriving at the same time.
3. Addition of a Driver identification and login page so that each bus driver can be properly categorized and monitored
4. Extension of the NeDB database to a more persistent db such as MongoDB
5. Use of AWS services in deploying the application
