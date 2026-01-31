# Schema - MyCampusGym

### Campuses
> The Campuses collection contains a document for each Campus that uses MyCampusGym and contains general informatino about the institution. This collection is referenced by many other collections.

| Field | Relates To | Default Value | Description
| ------ | ------ | ----- | ----- |
| campusName | | | The name of the Campus. |
| id | | | The DocumentID of the Campus document. |

### Facilities
> The Facilities collections contains a document for each Facility at each Campus that uses MycampusGym. This collection is referenced by many other collections.

| Field | Relates To | Default Value | Description
| ------ | ------ | ----- | ----- |
| campusId | Campuses | | The ID of the Campus document this Facility belongs to. |
| campusName | | | The name of the Campus the Facility belongs to. |
| id | | | The DocumentID of the Facility document. |
| name ||| The name of the Facility. |

### Profiles
> The Profiles collection contains a document for each User of MyCampusGym along with individual data about the User. This data is separate and in addition to the primary data stored in Firebase Authentication.

| Field | Relates To | Default Value | Description
| ------ | ------ | ----- | ----- |
| birthday | | | The users birthday. |
| campusId | Campsues | | The Id of the Campus document the User belongs to. |
| campusName | | | The name of the Campus the User belongs to. |
| email | | | The email address of the User. |
| firstName | | | The first name of the User. |
| id | | | The DocumentID of the Profile document. |
| lastName | | | The last name of the User. |
| uid | FirebaseAuth | | The Id of the User's record in FirebaseAuthentication. |

### Workouts
> The Workouts collectino contains a document for each Workout that a User records in the MyJournal module of MyCampusGym.

| Field | Relates To | Default Value | Description |
| ----- | ---------- | ------------- | ----------- |
| breakfast | | | Contains a User entered description of their breakfast for the day. |
| dinner | | | Contains a User entered description of their dinner for the day. |
| endTime | | | The time the User finished the workout. |
| exercises | | | An array of Exercises that were entered for the workout that includes the name of the exercise, the reps, sets, and weight used. |
| lunch | | | Contains a User entered description of their lunch for the day. |
|snacks | | | Contains a User entered description of their snacks for the day. |
| startTime | | | The time the User started the workout. |
| uid | FirebaseAuth | | The Id fo the User's record in FirebaseAuthentication. | 
