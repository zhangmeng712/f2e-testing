/**
 * @fileOverView LoginPage登陆页面的pageobject
 * @author zhangmeng on 15/11/20
 */
this.LoginPage = $page("Login page",{
    username: "input[name='login.username']",
    password: "input[name='login.password']",
    loginButton: "button.button-login"

},{
    errorMessage: "#login-error-message",
    //输出登陆完成的日志
    loginAs: loggedFunction ("Log in as ${_1.username} with password ${_1.password}", function(user) {
        this.username.typeText(user.username);
        this.password.typeText(user.password);
        this.loginButton.click();
    })
})