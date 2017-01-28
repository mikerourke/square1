import { expect } from 'chai';
import { normalize } from 'normalizr';
import { fromJS } from 'immutable';
import Lead, { leadSchema } from '../model';
import mockDb from '../../../../tools/api/db.json';

/**
 * Helper method that finds the specified lead in the db.json file and
 *      converts it to an Immutable Record representing a Lead entity.
 * @param {number} leadId Id number of the lead to find.
 * @returns {Record}
 */
const getLeadFromId = (leadId) => {
    const leadFromDb = mockDb.leads.find(lead => lead.id === leadId);
    return new Lead(fromJS(leadFromDb));
};

describe('Lead Model', () => {
    it('normalizes Lead entities', () => {
        const normalizedData = normalize(mockDb.leads, leadSchema);
        expect(normalizedData).to.contain.all.keys(['entities', 'result']);
    });

    it('successfully creates a Lead record', () => {
        const leadRecord = getLeadFromId(1);
        expect(leadRecord.source).to.equal('Other');
    });

    it('puts the appointments from a Lead into an array of objects', () => {
        const leadRecord = getLeadFromId(1);
        expect(leadRecord.appointments.size).to.equal(1);
    });
});