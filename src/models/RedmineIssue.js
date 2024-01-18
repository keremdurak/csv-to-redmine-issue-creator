class RedmineIssue {
    // constructor(data) {
    //     this.issueData = data;
    // }
    constructor(data) {
        this.issueData = {
            project_id: data.project_id, // int4
            tracker_id: data.tracker_id, // int4
            status_id: data.status_id, // int4
            priority_id: data.priority_id, // int4
            subject: data.subject,  // varchar
            description: data.description, // text
            category_id: data.category_id, // int4
            fixed_version_id: data.fixed_version_id, // int4
            assigned_to_id: data.assigned_to_id, // int4
            parent_issue_id: data.parent_issue_id,
            custom_fields: data.custom_fields, //https://www.redmine.org/projects/redmine/wiki/Rest_api#Working-with-custom-fields
            watcher_user_ids: data.watcher_user_ids, //Array of user ids to add as watchers (since 2.3.0)
            is_private: data.is_private,  // boolean //Use true or false to indicate whether the issue is private or not
            estimated_hours:data.estimated_hours,  // float8 //Number of hours estimated for issue
            start_date: data.start_date, // date
            due_date: data.due_date, // date
            // ...
        };
    }

    getIssueData() {
        return this.issueData;
    }
}

module.exports = RedmineIssue;