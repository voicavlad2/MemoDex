'use strict';

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const { sequelize } = require('../Models/database');

const userRoutes = require('./Routes/userRoutes');
const noteRoutes = require('./Routes/noteRoutes');
const sharedNoteRoutes = require('./Routes/sharedNoteRoutes');
const attachmentRoutes = require('./Routes/attachmentRoutes');
const groupRoutes = require('./Routes/groupRouter');
const tagRoutes = require('./Routes/tagRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/user', userRoutes);
app.use('/note', noteRoutes);
app.use('/sharedNote', sharedNoteRoutes);
app.use('/attachment', attachmentRoutes);
app.use('/group', groupRoutes);
app.use('/tag', tagRoutes);

app.get('/', (req, res) => {
    res.send('Pe bune');
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
