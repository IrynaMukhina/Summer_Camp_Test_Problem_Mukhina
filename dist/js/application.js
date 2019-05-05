const localStorageKeyPurch = 'myPurchaseList';
const jsonPurch = localStorage.getItem(localStorageKeyPurch);
let purchaseList = JSON.parse(jsonPurch) || [];

let receiveRate = function(curr) {
  const url = 'http://data.fixer.io/api/latest?access_key=c2cb5609f200c8bff6e7bb47db4dbf5d&symbols=' + curr;
  $.ajaxSetup({
    async: false
  });
  let rate;
  $.getJSON(url, function(data) {
    for(let key in data.rates) {
      rate = data.rates[key];
    }
  })
  
  return rate;
};

const addPurch = document.getElementById('add-btn');
const showPurch = document.getElementById('show-btn');
const clearPurch = document.getElementById('clear-btn');
const clearAllPurch = document.getElementById('clear-all-btn');
const reportPurch = document.getElementById('report-btn');
const wrapper = document.getElementById('list-wrapper');

const NewUserPurchase = function() {
  return {
    date: this.dateP,
    items: [{
      amount: this.amountP,
      currency: this.currencyP,
      productName: this.productP
    }]
  }
}

addPurch.addEventListener('click', createPurchase);
clearPurch.addEventListener('click', clear);
reportPurch.addEventListener('click', reportTotalYear);
showPurch.addEventListener('click', showAll);
clearAllPurch.addEventListener('click', clearAll);

function setLocalStorageObjectItem(array, localStorageKey) {
  localStorage.setItem(localStorageKey, JSON.stringify(array));
}


function createPurchase(data) {
  data = document.getElementById('add').value;
  const dataArr = data.split(' ');
  if(data.length != 0 && dataArr.length >= 4) {
    document.getElementById('add').value = '';
    dataArr.forEach(el => {
      if (validDate(el) && el.split('-').length === 3) {
        this.dateP = el;
      } else if (validCurrency(el)) {
        this.currencyP = el;
      } else if (validAmount(el)){
        this.amountP = el;
      } else {
        this.productP = el;
      }
    });
    if(purchaseList.some(el => el.date === this.dateP)) {
      for(let i = 0; i < purchaseList.length; i++) {
        if(this.dateP === purchaseList[i].date) {
          purchaseList[i].items.push({
            amount: this.amountP,
            currency: this.currencyP,
            productName: this.productP
          })
        }
      }
      makeAbleBtn();
      setLocalStorageObjectItem(purchaseList, localStorageKeyPurch);
      showMessage();
    } else {
      purchaseList.push(NewUserPurchase.call(this));
      setLocalStorageObjectItem(purchaseList, localStorageKeyPurch);
      makeAbleBtn();
      showMessage();
    }
  } else {
    clearContainer(wrapper);
    let text = document.createElement('p');
    text.className = 'empty-input';
    wrapper.appendChild(text);
    text.innerHTML = 'Please enter string in format "YYYY-MM-DD 0 USD Product"';
  }
}

function showAll() {
  if (purchaseList.length > 0) {
    showMessage();
  } else {
    showEmptyMessage();
  }
}

function showMessage() {
  sortArray(purchaseList);
  clearContainer(wrapper);
  purchaseList.forEach(el => {
    let purch = document.createElement('li');
    purch.className = 'purchase-list-el';
    let dateText = document.createElement('p');
    dateText.className = 'purchase-date';
    dateText.innerHTML = `${el.date}`;
    wrapper.appendChild(purch);
    purch.appendChild(dateText);
    el.items.map(el => {
      let itemText = document.createElement('p');
      itemText.className = 'purchase-item';
      itemText.innerHTML = `${el.productName} ${el.amount} ${el.currency}`;
      purch.appendChild(itemText);
    });
  });
}

function clear(data) {
  if (purchaseList.length > 0) {
    data = document.getElementById('clear').value;
    document.getElementById('clear').value = '';
    if(data.length != 0 && validDate(data) && data.split('-').length === 3) {
      if(purchaseList.every(el => new Date(el.date).getTime() !== new Date(data).getTime())) {
        createParagraph('error-message');
        text.innerHTML = 'There is no any purchaise for this date';
      } else {
        for(let i = 0; i < purchaseList.length; i++) {
          if(new Date(purchaseList[i].date).getTime() === new Date(data).getTime()) {
            purchaseList.splice(i, 1);
            setLocalStorageObjectItem(purchaseList, localStorageKeyPurch);
            showAll();
          }
        }
      }
    } else {
      createParagraph('empty-input');
      text.innerHTML = 'Please enter string in format "YYYY-MM-DD"';
    }
  } else {
    showAll();
  }
}

function clearAll() {
  if(purchaseList.length > 0) {
    const approve = confirm('Do you really want to delete all purchases list?');
    if(approve) {
      purchaseList = [];
      setLocalStorageObjectItem(purchaseList, localStorageKeyPurch);
      createParagraph('deleted-message');
      text.innerHTML = 'Purchase list is fully deleted';
    }
  } else {
    showAll();
  }
}

function reportTotalYear(data) {
  if (purchaseList.length > 0) {
    data = document.getElementById('report').value;
    document.getElementById('report').value = '';
    const dataArr = data.split(' ');
    if(data.length != 0 && dataArr.length === 2) {
      const year = dataArr[0];
      const currency = dataArr[1];
      let yearEl = purchaseList.filter(el => {
        return el.date.split('-')[0] === year;
      });
      if (yearEl.length > 0) {
        let totalInEuro = yearEl.reduce((sum, el) => {
        
          return sum + el.items.reduce((sum, el) => {
            let elRate = receiveRate(el.currency);
  
            return sum + Number(el.amount) / elRate;
          }, 0)
        }, 0);
        let totalInCurrency = parseFloat((totalInEuro * receiveRate(currency)).toFixed(2));
        clearContainer(wrapper);
        if (isNaN(totalInCurrency)) {
          createParagraph('error-message');
          text.innerHTML = 'Currency which you enter does not exist. Please try again';
        } else {
          createParagraph('total-year-message');
          text.innerHTML = `Total for ${year} in ${currency} currency is ${totalInCurrency}`;
        }
      } else {
        createParagraph('error-message');
        text.innerHTML = 'There is no any purchaise in this year';
      }
    } else {
      createParagraph('empty-message');
      text.innerHTML = 'Please enter string in format "YYYY USD"';
    }
  } else {
    showAll();
  }
}

//supported functions

function clearContainer(el) {
  if(el.hasChildNodes()) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
}

function sortArray(el) {
  const sortCondition = (a, b) => {
    return new Date(a.date) - new Date(b.date);
  };
  el.sort(sortCondition);
}

function createParagraph(classN) {
  clearContainer(wrapper);
  this.text = document.createElement('p');
  text.className = classN;
  wrapper.appendChild(text);
}

function showEmptyMessage() {
  createParagraph('empty-message');
  text.innerHTML = 'Purchase list is empty. Please add purchase to the list';
  makeDisableBtn();
}

function makeDisableBtn() {
  showPurch.disabled = true;
  clearPurch.disabled = true;
  clearAllPurch.disabled = true;
  reportPurch.disabled = true;
}

function makeAbleBtn() {
  showPurch.disabled = false;
  clearPurch.disabled = false;
  clearAllPurch.disabled = false;
  reportPurch.disabled = false;
}

//function for data validation

function validDate(data) {
  return new Date(data).toLocaleString() == 'Invalid Date' ? false : true;
}

function validCurrency(data) {
  this.carrencyArr = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD",
  "BIF","BMD","BND","BOB","BRL","BSD","BTC","BTN","BWP","BYN","BYR","BZD","CAD","CDF","CHF","CLF","CLP","CNY","COP",
  "CRC","CUC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GGP","GHS",
  "GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","IMP","INR","IQD","IRR","ISK","JEP","JMD",
  "JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LVL","LYD",
  "MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR",
  "NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK",
  "SGD","SHP","SLL","SOS","SRD","STD","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH",
  "UGX","USD","UYU","UZS","VEF","VND","VUV","WST","XAF","XAG","XAU","XCD","XDR","XOF","XPF","YER","ZAR","ZMK","ZMW",
  "ZWL"];
  
  return this.carrencyArr.indexOf(data) >= 0;
}

function validAmount(data) {
  return Number(data);
}


