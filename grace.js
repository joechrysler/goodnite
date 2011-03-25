//=================================================================+
// Alert users that have started using grace logins
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

// Initialize the Zimlet Framework  --  helpful
//=================================================================+
  function zmGrace() {} 
  zmGrace.prototype               = new ZmZimletBase();
  zmGrace.prototype.constructor   = zmGrace;
  zmGrace.prototype.init          = function() { this._displayDialog(); };


// Send AJAX request
//   zimbra stores usernames with @domain, ldap stores them without
//   the @... inconsistencies abound. ye be warned.
//=================================================================+
  zmGrace.prototype._displayDialog = function() {
    var username    = appCtxt.get(ZmSetting.USERNAME).split("@")[0];
    var jspUrl      = this.getResource("findGraceLogins.jsp") + "?username=" + username;
    var callback    = new AjxCallback(this, this._rpcCallback, ["username"]);

    AjxRpc.invoke(null, jspUrl, null, callback, true);
  };


// Check the AJAX result
//   Users with <20 grace logins have an expired password.
//=================================================================+
zmGrace.prototype._rpcCallback = function(p1, response) {
  var warningMessage = "Your password has expired.<br />"
                     + "Please visit SVSU's home page and <br />"
                     + "click <a href='https://pwm.svsu.edu/pwm/'>Change Network Password</a> <br />"
                     + "in the Quicklinks section. <br />"
                     + "<p style='font-size: normal;line-height:1.5em;'>"
                     + "You have <span style='color:red;font-weight:bold;font-size:1.5em;'>" 
                     + response.text
                     + "</span> grace logins remaining.</p>";

  var warningAnimation = [ZmToast.FADE_IN,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.PAUSE,
                          ZmToast.FADE_OUT];

  if (response.text < 20) {
    appCtxt.getAppController().setStatusMsg(warningMessage, ZmStatusView.LEVEL_CRITICAL, null, warningAnimation);
  }
};
