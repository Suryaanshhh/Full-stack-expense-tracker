

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
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/add-expense", Exp, {
      headers: { Authorisation: token },
    })
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
  //console.log(token);
  const decodeToken = parseJwt(token);
  //console.log(decodeToken);
  const Ispremium = decodeToken.premium;
  if (Ispremium) {
    premiumUserUi();
    showLeaderBoard();
  }
  axios
    .get("http://localhost:3000/get-expense", {
      headers: { Authorisation: token },
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

function premiumUserUi() {
  const premiumButton = document.getElementById("Buy");
  premiumButton.remove();

  const message = document.getElementById("message");
  message.textContent = "You are a Premium User";

  const downloadButton = document.createElement("button");
  downloadButton.id = "downloadExpenses";
  downloadButton.textContent = "Download Expenses";
  downloadButton.classList.add(
    "bg-gray-600",
    "text-white",
    "py-2",
    "px-4",
    "rounded",
    "hover:bg-gray-700",
    "focus:outline-none",
    "mr-2",
    "mt-4"
  );
  const form = document.querySelector("form");
  form.appendChild(downloadButton);

  document.getElementById("downloadExpenses").onclick = async function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios
      .get("http://localhost:3000/download-expense", {
        headers: { Authorisation: token },
      })
      .then((response) => {
        console.log(response);

        if (response.status == 200) {
          var a = document.createElement("a");
          a.href = response.data.fileURl;
          a.download = "myexpense.csv";
          a.click();
        } else {
          throw new Error("Server Error");
        }
      })
      .catch(console.log);
    axios
      .get("http://localhost:3000/get-url", {
        headers: { Authorisation: token },
      })
      .then((result) => {
        for(var j=0; j<result.data.Link.length; j++){
          showUrl(result.data.Link[j])
        }
      }); 
  };
}

function showUrl(Links){
  const parent=document.getElementById('listofUrl');
  console.log(parent)
const child=document.createElement('li');
const CloseBtn=document.createElement('button');
CloseBtn.innerText="Close";
child.textContent=`Already Downloaded -${Links.Link}`;
parent.appendChild(child);
parent.appendChild(CloseBtn)
}


function showUser(expense) {
  const Expense = document.getElementById("Expense");
  const list = document.createElement("li");
  const delBTN = document.createElement("button");
  list.id = `${expense.id}`;
  console.log(expense.id);
  delBTN.innerText = "Delete";
  delBTN.style.color = "lightgray";

  delBTN.style.backgroundColor = "transparent";

  delBTN.style.border = "1px solid lightgray";

  delBTN.style.cursor = "pointer";

  delBTN.style.padding = "5px 10px";
  delBTN.style.margin = "5px";
  delBTN.addEventListener("mouseover", function () {
    this.style.border = "1px solid darkgray";
  });
  delBTN.addEventListener("mouseout", function () {
    this.style.border = "1px solid lightgray";
  });
  list.textContent = `${expense.money}-${expense.description}-${expense.category} `;
  Expense.appendChild(list);
  list.appendChild(delBTN);

  delBTN.addEventListener("click", function () {
    axios
      .delete(`http://localhost:3000/delete-expense/${list.id}`)
      .then(() => {
        //const child = document.getElementById("list.id");
        //Expense.removeChild(child);
        //console.log("refresh ho raha");
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

const Premium = document.getElementById("Buy");

Premium.addEventListener("click", function (event) {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/Premium-Membership", {
      headers: { Authorisation: token },
    })
    .then((response) => {
      //console.log("jhatu code");
      //console.log(response);
      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: function (response) {
          axios
            .post(
              "http://localhost:3000/Transaction-Status",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorisation: token } }
            )
            .then((response) => {
              alert("You are premium user now");
              premiumUserUi();
              //console.log("remove ho jao")
              localStorage.setItem("token", response.data.token);
              showLeaderBoard();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      };
      const Razor = new Razorpay(options);
      Razor.open();
      Razor.on("payment.failed", function () {
        alert("Something went wrong");
      });
    })
    .catch((err) => {
      console.log(err);
    });

  event.preventDefault();
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showLeaderBoard() {
  const BTN = document.createElement("button");
  BTN.id = "pre";
  BTN.textContent = "Show Leaderboard";
  BTN.style.backgroundColor = "#333";
  BTN.style.color = "#fff";
  BTN.style.border = "thin solid cyan";
  BTN.style.borderRadius = "5px";
  BTN.style.padding = "10px 20px";
  BTN.style.margin = "10px";
  BTN.style.cursor = "pointer";
  document.getElementById("pre").appendChild(BTN);
  BTN.onclick = async () => {
    const token = localStorage.getItem("token");
    try {
      const LeaderboardArray = await axios.get(
        "http://localhost:3000/showLeaderBoard",
        { headers: { Authorisation: token } }
      );
      console.log(LeaderboardArray);
      const main = document.getElementById("leaderboard");
      main.innerHTML = `<h1>Leader Board</h1>`;
      let usersHTML = "";
      LeaderboardArray.data.forEach((userDetails) => {
        console.log(userDetails);

        usersHTML += `<li>Name-${userDetails.name} Total Expenses-${userDetails.total}</li>`;
      });

      main.innerHTML += usersHTML;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };
}
