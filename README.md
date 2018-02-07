# Vobi Voting app

## Project will be two layer, Backend and frontend:

You have to use:

Backend technologies
* ბაზა: mongodb (mongoose orm),
* Promises, async-wait
* express.js

Frontend Technologies: 
* react.js
* redux saga
* material-ui (http://www.material-ui.com/#/)
* immutable


Project Feautres:
* 1)login
* 2)signup

* 3)create a voting
* 4)update a voting
* 5)list voting
* 6)delete a voting

* 7)User can not vote more than one in a voting
* 8)Show Report by chart.js if show report in process is true, other way only after finished the voting
* 9)Report must show how many precent get each candicate
* 10)Only login user can vote the voting
* 11)App has to posibility to show static during the voting if it's enabled.

#### User fields:
```
user:
id
username,
email,
created,
activated
Photo
Personal number
```

#### Voting fields:
```
name,
date,
created,
modified,
description,
startDate
endDate
user
Options
Quesitons
Category
```

### Pages
* 1)Voting list page (actions: edit, delete, add)
* 2)Voting details page: (Report form (after finished or show if enabled), vote form).

For example:
if voting is 'Which is good laptop'? 
options: 1)Mac book 2)Hp 3)Samsung
detail page url would be localhost:4000/which-is-good-laptop

Report would show on the report:
1)Mac book - 50% 2)Hp - 30% 3)Samsung 20%
