1. POST /auth/login (admin, subscriber)

body
user_name*
password*

2. POST /api/food (admin, subscriber)

header
x-access-token

body
food_name*              - product name
unit_of_measurement*    - (litre/gram)
unit*                   - must be a number
calories*               - must be a number

3. PUT /api/food/:id (admin)

header
x-access-token

body
food_name*              - product name
unit_of_measurement*    - (litre/gram)
unit*                   - must be a number
calories*               - must be a number

4. DELETE /api/food/:id (admin)

header
x-access-token

5. GET /api/food (admin, subscriber)

header
x-access-token

query
food_id     - product id
food_name   - product name


6. POST /api/user/foodIntake (subscriber)

header
x-access-token

body
food_id*    - product id
unit*       - units consumed by subscriber
intake_at*  - consumed at

7. GET /api/user/food (admin, subscriber)

header
x-access-token

query
user_id     - admin should pass user_id, for subscriber token user_id will be used 
food_id     - product id
from        - consumed at
to          - consumed at


8. GET /api/report/userDaywise (subscriber)

header
x-access-token

9. POST /api/user/threshold (subscriber)

header
x-access-token

body
threshold*  - must be a number

10. GET /api/admin/report (admin)

header
x-access-token



