"use strict";

var Options = new function() {
  var DEFAULT_SIM_SETTINGS = {
    country: "USA",
    operator: "T-Mobile",
    operatorCode: "31020"
  };

  var DEFAULT_DEVICE = {
    sdk: 16,
    codename: "hammerhead"
  };

  var SDK_LIST = {
    "4":  "Donut 1.6",
    "5":  "Eclair 2.0",
    "6":  "Eclair 2.0.1",
    "7":  "Eclair 2.1",
    "8":  "Froyo 2.2-2.2.3",
    "9":  "Gingerbread 2.3-2.3.2",
    "10": "Gingerbread 2.3.3-2.3.7",
    "11": "Honeycomb 3.0",
    "12": "Honeycomb 3.1",
    "13": "Honeycomb 3.2",
    "14": "Ice Cream Sandwich 4.0-4.0.2",
    "15": "Ice Cream Sandwich 4.0.3-4.0.4",
    "16": "Jelly Bean 4.1",
    "17": "Jelly Bean 4.2",
    "18": "Jelly Bean 4.3",
    "19": "KitKat 4.4",
    "20": "KitKat (wearable extensions) 4.4",
    "21": "Lollipop 5.0"
  }

  var DEVICE_LIST = {
    "tilapia":      "Asus Nexus 7",
    "enrc2b":       "HTC One X+",
    "g3":           "LG G3",
    "cosmo":        "LG Google TV",
    "mako":         "LG Nexus 4",
    "hammerhead":   "LG Nexus 5",
    "ghost":        "Motorola Moto X",
    "roth":         "Nvidia Shield",
    "m0":           "Samsung Galaxy S3",
    "ja3g":         "Samsung Galaxy S4",
    "k3g":          "Samsung Galaxy S5",
    "cross77_3776": "Sony Xperia Fusion",
    "togari":       "Sony Xperia Z"
  }

  var formInfo, formLogin,
    txtAuthEmail, txtDeviceId,
    inpEmail, inpPassword, inpDeviceId,
    btnLogin, btnLogout, btnSave;

  /**
   * ClientLogin errors, taken from
   * https://developers.google.com/accounts/docs/AuthForInstalledApps
   */
  var clientLoginErrors = {
    "BadAuthentication": "Incorrect username or password.",
    "NotVerified": "The account email address has not been verified. You need to access your Google account directly to resolve the issue before logging in here.",
    "TermsNotAgreed": "You have not yet agreed to Google's terms, acccess your Google account directly to resolve the issue before logging in using here.",
    "CaptchaRequired": "A CAPTCHA is required. (not supported, try logging in another tab)",
    "Unknown": "Unknown or unspecified error; the request contained invalid input or was malformed.",
    "AccountDeleted": "The user account has been deleted.",
    "AccountDisabled": "The user account has been disabled.",
    "ServiceDisabled": "Your access to the specified service has been disabled. (The user account may still be valid.)",
    "ServiceUnavailable": "The service is not available; try again later."
  };

  var clearData = function(callback) {
    BrowserStorage.remove(["account", "sim"], callback);
  }

  var saveAccount = function(data, callback) {
    BrowserStorage.set({
      account: data
    }, callback);
  }

  var getAccountSettings = function(callback) {
    BrowserStorage.get(["sim", "account"], function(items) {
      if (!items.sims) {
        setSimSettings(DEFAULT_SIM_SETTINGS);
        items.sim = DEFAULT_SIM_SETTINGS;
      }

      callback.call(null, items);
    });
  }

  var setSimSettings = function(sim, callback) {
    BrowserStorage.set({
      sim: sim
    }, callback);
  };

  var refreshViews = function() {
    getAccountSettings(function(items) {
      if (!items.account) {
        inpEmail.value = "";
        inpPassword.value = "";
        inpDeviceId.value = "";

        txtAuthEmail.textContent = "";
        txtDeviceId.textContent = "";
        formLogin.style.display = "block";
        formInfo.style.display = "none";
      } else {
        if (!items.account.deviceCodename) {
          items.account.deviceCodename = DEFAULT_DEVICE.codename;
        }

        if (!items.account.deviceSdk) {
          items.account.deviceSdk = DEFAULT_DEVICE.sdk;
        }

        txtAuthEmail.textContent = items.account.email;
        txtDeviceId.textContent = items.account.deviceId.toUpperCase();

        renderSdkList(items.account.deviceSdk);
        renderDeviceList(items.account.deviceCodename);

        formInfo.style.display = "block";
        formLogin.style.display = "none";
      }
    });
  };

  var login = function(email, password, deviceId) {
    var ACCOUNT_TYPE_HOSTED_OR_GOOGLE = "HOSTED_OR_GOOGLE";
    var URL_LOGIN = "https://www.google.com/accounts/ClientLogin";
    var LOGIN_SERVICE = "androidsecure";

    var params = {
      "Email": email,
      "Passwd": password,
      "service": LOGIN_SERVICE,
      "accountType": ACCOUNT_TYPE_HOSTED_OR_GOOGLE
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", URL_LOGIN, true);

    var paramsStr = "";
    for (var key in params) {
      paramsStr += "&" + key + "=" + encodeURIComponent(params[key])
    }

    xhr.onload = function() {
      var AUTH_TOKEN = "";
      var response = xhr.responseText;

      var error = response.match(/Error=(\w+)/);
      if (error) {
        var msg = clientLoginErrors[error[1]] || error[1];
        alert("ERROR: authentication failed.\n" + msg);
        return;
      }

      var match = response.match(/Auth=([a-z0-9=_\-]+)/i);
      if (match) {
        AUTH_TOKEN = match[1];
      }

      if (!AUTH_TOKEN) {
        // should never happen...
        alert("ERROR: Authentication token not available, cannot login.");
        return;
      }

      saveAccount({
        email: email,
        authToken: AUTH_TOKEN,
        deviceId: deviceId,
        deviceSdk: DEFAULT_DEVICE.sdk,
        deviceCodename: DEFAULT_DEVICE.codename
      }, function() {
        window.location.reload();
      });
    };

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(paramsStr);
  };

  var renderSdkList = function(currentSdk) {
    var sltSdk = document.getElementById('android_version');
    if (sltSdk.hasAttribute('rendered')) {
      return;
    }

    for (var key in SDK_LIST) {
      var option = document.createElement('option');
      option.value = key;
      option.textContent = SDK_LIST[key] + " (SDK " + key + ")";
      if (currentSdk && currentSdk == key) {
        option.selected = "selected";
      }

      sltSdk.appendChild(option);
    }
    sltSdk.setAttribute('rendered', 1);
  }

  var renderDeviceList = function(codename) {
    var sltDevice = document.getElementById('android_device');
    if (sltDevice.hasAttribute('rendered')) {
      sltDevice.dispatchEvent(new Event('change', {'bubbles': true}));
      return;
    }

    var selected = false;
    for (var key in DEVICE_LIST) {
      var option = document.createElement('option');
      option.value = key;
      option.textContent = DEVICE_LIST[key];
      if (codename && codename == key) {
        option.selected = 'selected';
        selected = true;
      }

      sltDevice.appendChild(option);
    }

    var txtCodename = document.getElementById('android_codename');
    var customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    if (!selected) {
      customOption.selected = 'selected';
      txtCodename.value = codename;
    }
    sltDevice.appendChild(customOption);

    sltDevice.addEventListener('change', function(e) {
      var value = e.target.value;
      if (value === 'custom') {
        txtCodename.removeAttribute('disabled');
      } else {
        txtCodename.disabled = 'disabled';
        txtCodename.value = value;
      }
    });
    sltDevice.setAttribute('rendered', 1);
    sltDevice.dispatchEvent(new Event('change', {'bubbles': true}));
  }

  var initForm = function() {
    formInfo = document.getElementById("info_form");
    formLogin = document.getElementById("login_form");

    txtAuthEmail = document.getElementById("auth_email");
    txtDeviceId = document.getElementById("device_id");

    inpEmail = document.getElementById("user_email");
    inpEmail.addEventListener("blur", function(e) {
      if (inpEmail.value.length > 0 && inpEmail.value.indexOf("@") === -1) {
        inpEmail.value = inpEmail.value + "@gmail.com";
      }
    });
    inpPassword = document.getElementById("user_password");
    inpDeviceId = document.getElementById("user_device_id");

    btnLogin = document.getElementById("btn_login");
    btnLogin.addEventListener("click", function(e) {
      e.preventDefault();

      var email = inpEmail.value;
      var password = inpPassword.value;
      var deviceId = inpDeviceId.value;

      var match = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(email);
      if (!match) {
        alert('ERROR: Please enter valid email!');
        inpEmail.focus();
        return;
      }

      if (password.length == 0) {
        alert('ERROR: Please enter a password!');
        inpPassword.focus();
        return;
      }

      if (!/^[0-9a-f]{16}$/i.test(deviceId)) {
        alert('ERROR: Android Device ID must be 16 characters long and only contains characters from 0-9, A-F');
        inpDeviceId.focus();
        return;
      }

      login(email, password, deviceId);
    });

    btnLogout = document.getElementById("btn_logout");
    btnLogout.addEventListener("click", function(e) {
      e.preventDefault();

      if (confirm('Change to another email?')) {
        clearData(refreshViews)
      }
    });

    btnSave = document.getElementById("btn_save");
    btnSave.addEventListener("click", function(e) {
      e.preventDefault();

      var sdkVersion = document.getElementById('android_version').value;

      var txtCodename = document.getElementById('android_codename');
      var codename = txtCodename.value.trim();
      if (codename.length == 0) {
        alert('Please enter device codename');
        txtCodename.focus();
        return;
      }

      getAccountSettings(function(items) {
        items.account.deviceSdk = sdkVersion;
        items.account.deviceCodename = codename;

        saveAccount(items.account, function() {
          window.location.reload();
        });
      });
    });

    var tooltips = document.querySelectorAll(".help-msg");
    for (var i = 0, size = tooltips.length; i < size; i++) {
      tooltips[i].addEventListener('mousedown', function(e) {
        if (e.target.nodeName == 'A') {
          e.target.click();
        }
      });
    }
  }

  var init = function() {
    initForm();
    refreshViews();
  }

  this.init = init;
}

Options.init();