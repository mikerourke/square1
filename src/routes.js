import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, LoginPage, LeadsPage, ManageLeadPage } from './scenes';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={LoginPage} />
        <Route path="login" component={LoginPage} />
        <Route path="leads" component={LeadsPage} />
        <Route path="lead" component={ManageLeadPage} />
        <Route path="lead/:id" component={ManageLeadPage} />
    </Route>
);
