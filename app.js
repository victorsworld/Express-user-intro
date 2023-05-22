// Bring in Express code
const express = require('express');

const app = express();
const port = 3000;
const userList = require('./userData');

app.use(express.json()); // This line is necessary for Express to be able to parse JSON in request body's

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/user-list', (req, res) => {
  res.json({ data: userList });
});

app.get('/single-user/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const user = userList.find((user) => user.phone === phoneNumber);
  res.json(user);
});

app.get('/some-user/:country', (req, res) => {
  const country = req.params.country.toLocaleLowerCase();
  const filter = userList.filter((elem) => {
    return elem.location.country.toLocaleLowerCase().includes(country);
  });
  res.json({ data: filter });
});

app.post('/new-user', (req, res) => {
  console.log('New user received:', req.body);
  let errorArr = [];

  const newUser = {
    gender: req.body.gender,
    name: {
      title: req.body.name.title,
      first: req.body.name.first,
      last: req.body.name.last,
    },
    location: {
      city: req.body.location.city,
      state: req.body.location.state,
      country: req.body.location.country,
      postcode: req.body.location.postcode,
    },
    email: req.body.email,
    phone: req.body.phone,
    cell: req.body.cell,
    nat: req.body.nat,
  };
  for (let key in newUser) {
    if (newUser[key] === '' || newUser[key] === undefined) {
      errorArr.push(`${key} cannot be empty`);
    } else {
      userList.push(newUser);
      res.status(200).json({ message: 'Success' });
    }
  }
});

app.put('/update-user/:userEmail', (req, res) => {
  const email = req.params.userEmail;
  const findIndex = userList.findIndex((user) => user.email === email);

  if (findIndex === -1) {
    return res.status(400).json({ success: false, message: 'User not found' });}
  
  const user = userList[findIndex];
  const updatedUserEmail = { ...user };
  console.log(updatedUserEmail)

  for (let key in req.body) {
	console.log(typeof req.body[key])
	if(typeof req.body[key] === "object"){
    updatedUserEmail[key] = {
		...updatedUserEmail[key],
		...req.body[key]
		};
	}
	else{
		updatedUserEmail[key] = req.body[key]
	}
  }
  	console.log("after", updatedUserEmail)
	userList.splice(findIndex, 1, updatedUserEmail)
	res.status(200).json({ success: true})
})



  app.delete('/delete-user/:cellNumber', (req, res) => {
    const cellNumber = req.params.cellNumber;
    const findIndex = userList.findIndex(user => user.cell === cellNumber);

    if (findIndex !== -1) {
        userList.splice(findIndex, 1);
        res.status(200).send({ success: true });
    } else {
        res.status(404).send({ success: false, message: 'User not found' });
    }


  userList.splice(findIndex, 1, updatedUserEmail);

  console.log(updatedUserEmail);
  res.status(200).json({ message: 'Success' });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
