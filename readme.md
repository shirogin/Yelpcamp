**Add the comment model!**
- Make our errors go away!
- Display comments on campground show page

**Comment New/Create**
1. Discuss nested routes
2. Add the comment new and create routes
3. Add the new comment form


**RESTFUL ROUTES**

| NAME   |    URL    | VERB  |                    DESCRIPTION |
| :----- | :-------: | :---: | -----------------------------: |
| index  |   /dogs   |  GET  |     display a list of all dogs |
| NEW    | /dogs/new |  GET  | display form to make a new dog |
| CREATE |   /dogs   | POST  |              add new dog to DB |
| SHOW   | /dogs/:id |  GET  |        show info about one dog |

**NEW COMMENTS ROUTES**

| NAME   |             URL              | VERB |
| :----- | :--------------------------: | ---: |
| NEW    | campgrounds/:id/comments/new |  GET |
| CREATE |   campgrounds/:id/comments   | POST |

