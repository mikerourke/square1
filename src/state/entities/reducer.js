/* @flow */

/* External dependencies */
import { combineReducers } from 'redux-immutable';

/* Internal dependencies */
import changes from './changes/reducer';
import leads from './leads/reducer';
import messages from './messages/reducer';
import notes from './notes/reducer';
import users from './users/reducer';

const entities = combineReducers({
  changes,
  leads,
  messages,
  notes,
  users,
});

export default entities;
