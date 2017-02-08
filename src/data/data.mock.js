import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';

const mockDb = {
    leads: [{
        id: 1,
        leadName: 'Steve Leadsman',
        source: 'Other',
        leadFee: 25,
        phone: '(630) 123-4567',
        email: 'steve@leads.com',
        address: '123 U.S. 1, Salisbury, MA, United States',
        description: 'This is a lead',
        status: 'New',
        appointments: [{ id: 1,
            subject: 'Appointment Test 1',
            startAt: '2013-10-21T13:00:00.419Z',
            endAt: '2013-10-21T15:00:00.419Z',
            appointmentFor: 'Who knows?',
            emailAlert: 'Alert, yo!',
            isAllDay: false }],
    }, {
        id: 2,
        leadName: 'Nancy Leadelstein',
        source: 'Saw Sign',
        leadFee: 25,
        phone: '(630) 123-4567',
        email: 'nancy@leads.com',
        address: '',
        description: 'This is another lead',
        status: 'Existing',
    },
    {
        id: 3,
        leadName: 'Paco Leadrojo',
        source: 'Saw Sign',
        leadFee: 25,
        phone: '(630) 123-4567',
        email: 'paco@leads.com',
        address: '',
        description: 'This is a third lead',
        status: 'New',
    }],
    users: [{
        id: 1,
        username: 'mike',
        firstName: 'Mike',
        lastName: 'Rourke',
        title: 'Warlock',
        isLoggedIn: 'false',
        password: 'mike',
    }],
    settings: [{
        id: 1,
        category: 'lists',
        settingName: 'sources',
        data: [
            { id: 1, value: 'Did work in area' },
            { id: 2, value: 'Facebook' },
            { id: 3, value: 'Flyer' },
            { id: 4, value: 'HomeAdvisor' },
            { id: 5, value: 'Saw Sign' },
        ],
    },
    {
        id: 2,
        category: 'lists',
        settingName: 'leadStatuses',
        data: [
            { id: 1, value: 'New' },
            { id: 2, value: 'Selling' },
            { id: 3, value: 'Won' },
            { id: 4, value: 'Qualified' },
            { id: 5, value: 'Lost' },
        ],
    },
    {
        id: 3,
        category: 'general',
        settingName: 'companyInfo',
        data: {
            companyName: 'Legend',
            address: '123 Company Lane',
            phone: '(630) 123-5555'
        },
    }],
};

const client = axios.create({
    responseType: 'json',
});

const middleware = [
    axiosMiddleware(client),
    thunk,
];

const mockClient = new MockAdapter(client);
const mockStore = configureStore(middleware);

export {
    mockClient,
    mockDb,
    mockStore,
};
