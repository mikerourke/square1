/* @flow */

// TODO: Add formatting for phone number.

/* External dependencies */
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

/* Internal dependencies */
import { preventSubmissionOnEnter } from 'lib/form-events';
import Lead from 'state/leads/model';
import FormColumn from 'components/forms/form-column';
import FormColumnsContainer from 'components/forms/form-columns-container';
import FormGeolocation from 'components/forms/form-geolocation';

/* Types */
import type { MapLocation, Selection } from 'lib/types';

/**
 * Form component for entering Lead details.
 * @param {Function} handleInputChange Action to perform when the value of an
 *      input is changed.
 * @param {Function} handleLocationChange Action to perform when the value
 *      of the Geolocation field is changed.
 * @param {Object} lead Lead entity associated with the form.
 * @param {Array} representativesList List of items that populate the
 *      Representatives select field.
 * @param {Array} sourcesList List of items that populate the Sources select
 *      field.
 */
export default class LeadDetailsForm extends React.Component {
    props: {
        handleInputChange: (event: Event, newValue: string,
                            inputName?: string) => void,
        handleLocationChange: (newLocation: MapLocation) => void,
        lead: Lead,
        representativesList: Array<Selection>,
        sourcesList: Array<Selection>,
    };

    componentDidMount(): void {
        // Ensure the form submission event isn't fired if the user presses
        // "Enter" after changinging the address.
        preventSubmissionOnEnter('geo-address');
    }

    render(): React.Element<*> {
        const {
            handleInputChange,
            handleLocationChange,
            lead,
            representativesList,
            sourcesList,
        } = this.props;

        return (
            <form id="lead-details-form">
                <FormColumnsContainer>
                    <FormColumn>
                        <TextField
                            floatingLabelText="Lead Name"
                            fullWidth={true}
                            name="leadName"
                            onChange={handleInputChange}
                            value={lead.leadName}
                        />
                        <SelectField
                            floatingLabelText="Source"
                            fullWidth={true}
                            onChange={
                                (event: Event, key: string, value: string) => {
                                    handleInputChange(event, value, 'source');
                                }}
                            value={lead.source}
                        >
                            {sourcesList.map(selection => (
                                <MenuItem
                                    key={selection.id}
                                    primaryText={selection.value}
                                    value={selection.value}
                                />
                            ))}
                        </SelectField>
                        <TextField
                            floatingLabelText="Lead Fee"
                            fullWidth={true}
                            name="leadFee"
                            onChange={handleInputChange}
                            value={lead.leadFee === 0 ? '' : lead.leadFee}
                        />
                        <TextField
                            floatingLabelText="Phone"
                            fullWidth={true}
                            name="phone"
                            onChange={handleInputChange}
                            value={lead.phone}
                        />
                        <TextField
                            floatingLabelText="Email"
                            fullWidth={true}
                            name="email"
                            onChange={handleInputChange}
                            value={lead.email}
                        />
                        <TextField
                            floatingLabelText="Description"
                            fullWidth={true}
                            name="description"
                            onChange={handleInputChange}
                            value={lead.description}
                        />
                        <SelectField
                            floatingLabelText="Assign To"
                            fullWidth={true}
                            onChange={
                                (event: Event, key: string, value: string) => {
                                    handleInputChange(event, value, 'assignTo');
                                }}
                            value={lead.assignTo}
                        >
                            {representativesList.map(selection => (
                                <MenuItem
                                    key={selection.id}
                                    primaryText={selection.value}
                                    value={selection.value}
                                />
                            ))}
                        </SelectField>
                    </FormColumn>
                    <FormColumn>
                        <FormGeolocation
                            floatingLabelText="Address"
                            handleLocationChange={handleLocationChange}
                            startingLocation={{
                                address: lead.address,
                                lat: lead.lat,
                                lng: lead.lng,
                            }}
                        />
                    </FormColumn>
                </FormColumnsContainer>
            </form>
        );
    }
}
