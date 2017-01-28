import { schema } from 'normalizr';
import { Record, List } from 'immutable';

const leadEntity = new schema.Entity('leads');
export const leadSchema = [leadEntity];

export default class Lead extends Record({
    id: 0,
    leadName: '',
    source: '',
    leadFee: 0,
    phone: '',
    email: '',
    address: '',
    description: '',
    comments: '',
    status: '',
    appointments: new List(),
}) {
    getAppointments() {
        const appointmentItems = this.appointments;
        if (List.isList(appointmentItems)) {
            return appointmentItems.toArray().map(appointment =>
                appointment.toJS());
        }
        return [];
    }
}