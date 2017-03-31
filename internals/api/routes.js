const moment = require('moment');

module.exports = (router, server) => {
    const db = router.db;

    const getCurrentTime = () =>
        moment().format('YYYY-MM-DD HH:mm:ss.SSS Z');

    /**
     * Finds the last element of the specified type in the database and returns
     *      the corresponding ID elements associated with the item.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @returns {Object} ID elements of the last child entity.
     */
    const getIdElementsOfLastChild = (parentName, childName) => {
        const parentEntities = db
            .get(`${parentName}s`)
            .value();

        let childIds = [];
        parentEntities.forEach(parent => {
            parent[`${childName}s`].forEach(child => childIds.push(child.id));
        });

        const lastChildId = Math.max(...childIds).toString();
        return {
            type: lastChildId.substring(0, 3),
            dateCreated: lastChildId.substring(3, 9),
            sequence: lastChildId.substring(9),
        };
    };

    /**
     * Returns the next ID number based on the entity type.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @returns {number} Next ID number.
     */
    const getNewId = (parentName, childName) => {
        const {
            type,
            dateCreated,
            sequence
        } = getIdElementsOfLastChild(parentName, childName);

        let dateForId = moment().format('YYMMDD');
        let sequenceForId = '0000';
        if (dateForId === dateCreated) {
            sequenceForId = sequence;
        }

        const idString = `${type}${dateForId}${sequenceForId}`;
        return (parseInt(idString, 10) + 1);
    };

    /**
     * Adds a route to the entity for handling GET requests, which returns the
     *      entity that matches the request parameters in the response.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @param {string} urlPath URL path of the request.
     */
    const addGetRoute = (parentName, childName, urlPath) => {
        server.get(urlPath, (req, res) => {
            const parentId = req.params[`${parentName}Id`];
            const childId = req.params[`${childName}Id`];
            const childToGet = db.get(`${parentName}s`)
                .getById(parentId)
                .get(`${childName}s`)
                .getById(childId)
                .value();
            res.jsonp(childToGet);
        });
    };

    /**
     * Adds a route to the entity for handling PATCH requests, which updates
     *      the entity in the database and returns the updated entity in the
     *      response.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @param {string} urlPath URL path of the request.
     */
    const addPatchRoute = (parentName, childName, urlPath) => {
        server.patch(urlPath, (req, res) => {
            const parentId = req.params[`${parentName}Id`];
            const childId = req.params[`${childName}Id`];
            const childRecord = Object.assign({}, req.body, {
               updatedAt: getCurrentTime(),
            });
            delete childRecord.typeName;
            db.get(`${parentName}s`)
                .getById(parentId)
                .get(`${childName}s`)
                .getById(childId)
                .assign(childRecord)
                .write();
            res.jsonp(childRecord);
        });
    };

    /**
     * Adds additional fields that would be generated by the server/database
     *      in production and removes fields that shouldn't be included in the
     *      update.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @param {Object} entity Entity from the request.
     * @returns {Object} Record entity with updated properties.
     */
    const getChildRecord = (parentName, childName, entity) => {
        const currentTime = getCurrentTime();
        let childRecord = Object.assign({}, entity, {
            id: getNewId(parentName, childName),
            createdAt: currentTime,
            createdBy: 'mike',
            updatedAt: currentTime,
        });
        delete childRecord.typeName;
        return childRecord;
    };

    /**
     * Adds a route to the entity for handling POST requests, which creates
     *      the entity in the database and returns the created entity in the
     *      response.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @param {string} urlPath URL path of the request.
     */
    const addPostRoute = (parentName, childName, urlPath) => {
        server.post(urlPath, (req, res) => {
            const parentId = req.params[`${parentName}Id`];
            const childrenInDb = db
                .get(`${parentName}s`)
                .getById(parentId)
                .get(`${childName}s`);

            const bodyData = req.body;
            if (Array.isArray(bodyData)) {
                const childrenForResponse = [];
                bodyData.forEach((bodyItem) => {
                    const childItem =
                        getChildRecord(parentName, childName, bodyItem);
                    childrenInDb
                        .push(childItem)
                        .write();
                    childrenForResponse.push(childItem);
                });
                res.jsonp(childrenForResponse);
            } else {
                const singleItem =
                    getChildRecord(parentName, childName, bodyData);
                childrenInDb
                    .push(singleItem)
                    .write();
                res.jsonp(singleItem);
            }
        });
    };

    /**
     * Adds a route to the entity for handling DELETE requests, which deletes
     *      the entity in the database and returns the deleted entity in the
     *      response.
     * @param {string} parentName Name of the parent entity.
     * @param {string} childName Name of the child entity.
     * @param {string} urlPath URL path of the request.
     */
    const addDeleteRoute = (parentName, childName, urlPath) => {
        server.delete(urlPath, (req, res) => {
            const parentId = req.params[`${parentName}Id`];
            const childId = req.params[`${childName}Id`];
            const childrenInDb = db
                .get(`${parentName}s`)
                .getById(parentId)
                .get(`${childName}s`);

            const childToDelete = childrenInDb
                .getById(childId)
                .value();

            childrenInDb
                .remove({ id: parseInt(childId, 10) })
                .write();

            res.jsonp(childToDelete);
        });
    };

    /**
     * Returns the child objects associated with the lead specified in the
     *      parameters.  This is used to ensure the normalized data isn't
     *      pushed to the database.
     * @param {number} leadId ID number of the parent lead.
     * @returns {Object} Child entities associated with the lead.
     */
    const getLeadChildren = (leadId) => {
        const leadInDb = db.get('leads').getById(leadId);
        return {
            changes: leadInDb.get('changes').value(),
            messages: leadInDb.get('messages').value(),
            notes: leadInDb.get('notes').value()
        }
    };

    /**
     * Adds any custom route(s) to the Lead entity.
     */
    const addLeadRoutes = () => {
        const urlPath = '/leads/:leadId';
        server.patch(urlPath, (req, res) => {
            const leadId = req.params['leadId'];
            const leadRecord = Object.assign({}, req.body, {
                updatedAt: getCurrentTime(),
            }, getLeadChildren(leadId));
            delete leadRecord.typeName;
            db.get('leads')
                .getById(leadId)
                .assign(leadRecord)
                .write();
            res.jsonp(leadRecord);
        });
    };

    const addChildRoutes = () => {
        const childName = ['change', 'message', 'note'];
        childName.forEach(child => {
            const routeUrl = `/leads/:leadId/${child}s`;
            addGetRoute('lead', child, `${routeUrl}/:${child}Id`);
            addDeleteRoute('lead', child, `${routeUrl}/:${child}Id`);
            addPatchRoute('lead', child, `${routeUrl}/:${child}Id`);
            addPostRoute('lead', child, routeUrl);
        });
    };

    addLeadRoutes();
    addChildRoutes();
    return server;
};
