const btn = document.getElementById("submit");

btn.addEventListener("click", function (event) {
  event.preventDefault();
  const money = document.getElementById("money").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const Exp = {
    money: money,
    description: description,
    category: category,
  };
  const token = localStorage.getItem("token")
  axios
    .post("http://localhost:3000/add-expense" , Exp,{headers:{"Authorisation":token}})
    .then((response) => {
      console.log(response);
      location.reload();
    })
    .catch((Err) => {
      console.log(Err);
    });
});

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  console.log(token);
  axios
    .get("http://localhost:3000/get-expense", 
    {
      headers:{"Authorisation":token},
    })
    .then((response) => {
      console.log(response);
      for (var i = 0; i < response.data.expenses.length; i++) {
        showUser(response.data.expenses[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

function showUser(expense) {
  const Expense = document.getElementById("Expense");
  const list = document.createElement("li");
  const delBTN = document.createElement("button");
  list.id = `${expense.id}`;
  console.log(expense.id);
  delBTN.innerText = "Delete";
  list.textContent = `${expense.money}-${expense.description}-${expense.category} `;
  Expense.appendChild(list);
  list.appendChild(delBTN);

  delBTN.addEventListener("click", function () {
    axios
      .delete(`http://localhost:3000/delete-expense/${list.id}`)
      .then(() => {
        //const child = document.getElementById("list.id");
        //Expense.removeChild(child);
        console.log("refresh ho raha");
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
