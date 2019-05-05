# Summer_Camp_Test_Problem_Mukhina
This web page is basic version of an application which allow to collect information about incomes and get annual income statistics.

To run the project download it, open project root directory and run 'npm start' command. After that, you can find a project at http://localhost:8080/. Also you can just open index.html file from src folder.

About Web Application
Entering data about purchases are stored in LocalStorage and available until the browser will be closed.

To add the new purchase to the list user should enter a date when a purchase has occurred, an amount of money spent by the customer, the currency in which purchase has occurred, the name of the product purchased.
This information can be entered in any order but should be appropriate to the given format.
If the input field is empty user will see the system message.
If input information does not pass validation system also will show the message.
After a user adds a valid purchase system will show a list of all purchases.
Also, the system combines purchases for the same date.

To clear purchase for some date user should enter a valid date in the second input field.
If purchase for this date is present in the list it will be deleted and the system will show rest purchases which are still present.
If input fields are empty or information does not pass validation, the system will show the message.
If purchase for this date is not present in the list system will show the appropriate message.

To get annual statistics about purchases total amount for some year User can enter the necessary year and currency in which this total amount should be presented to the third input field and press 'Report'.
If both parts of entering information are valid and purchases for the specified year are presented in the List system will show total in a given currency.
If some part of entering information is not valid or purchases for the specified year are not presented in the List system will show an appropriate message.

To delete all purchases from the List User can use 'Clear all' button. After pressing system will ask about confirmation. If user confirms deletion system deletes all List and show an appropriate message. If User decline confirmation system will do nothing.

To review all purchase User can use 'Show all' button. After pressing system will show all Purchase List.

In case if some button('Clear', 'Clear All', 'Show All', 'Report') will be press when List is empty system will show the message and make this button unavailable till the purchase will be added.

Thank you for review.
I will be waiting for your feedback.

P.S. To convert the amount of total I use double conversation (first to EUR and second to specified currency) as for the free period of usage, https://fixer.io is available only data with base currency EUR.
Also, I have found a bug in my project. If User wants to add purchase with product name with a couple of words separated by space, the system uses the last part of it. I tried to resolve it but unsuccessful. I think I need some help with it.





