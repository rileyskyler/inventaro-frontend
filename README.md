# inventaro-backend

### Point of Sale (POS) and Inventory Management System

<!--
Skyler Scribbles



-->


## Data

**Types**

- User
  - username
  - password
  - firstName
  - lastName
  - locations [...**Location**]

- Location
  - name
  - inventory [...**Stock**]
  - users [...**User**]

- Item
  - name
  - [upc](https://en.wikipedia.org/wiki/Universal_Product_Code)
  - price

- Stock
  - **Item**
  - quantity

<!-- 
NEEDLESS

**Structure**

Base queries

- U

- User's Locations
    - [...User] -> [...Location]

- Location's Users
    [...Location] -> [...User]

- Items -->