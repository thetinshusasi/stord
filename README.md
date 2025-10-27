# Stord Frontend Challenge

### Background

You are building a new products page to consolidate product views for two different versions of the product service (both house different data with different data shapes). There are some known issues with the service uptime; it will frequently return an error on get, post, and delete requests.

We want to be able to show products, create new ones, and delete existing ones.

### Requirements:

- Page should show a list of products from the v2 endpoints in a table with attributes matching the Figma design and handle any service errors
- User should be able to add a new product by clicking the `Create Product` button and using a modal that contains a new product form
- User should be able to delete a product which results in a modal being shown asking for confirmation
- User should be able to find products in the table by name or SKU with a client side search

* Bonus: Page should show a list of products from the v1 and v2 endpoints in a table with attributes matching the Figma design
* Bonus: search queries the service for updated records

### What we’re looking for:

- Error handling and Surfacing to the User
- Service Interactions
- Client side data management
- Design fidelity, doesn’t need to be pixel perfect but should resemble the Figma design

### Resources

[Figma](https://www.figma.com/file/PCH1AoGy7nI50KgKDGD6Qn/FE_INTERVIEW_WIREFRAME?node-id=0%3A1)

### Extra

These are libraries we use everyday but are not required to complete the exercise:

- [chakra-ui](https://chakra-ui.com/) (recommended)
- [react-query](https://react-query.tanstack.com)
- [react-hook-form](https://react-hook-form.com/)
