<!-- JS injection   Inject login form into the pre-login screen -->
<script type="text/javascript">
$(document).ready(function() {
    var snip = '<div class="card-text content" id="gotafe-frontpage-login"> <form class="loginform" id="login" method="post" action="/login/index.php"> <div class="form-group"> <label class="hidden" for="login_username">Username</label> <input name="username" id="login_username" class="form-control" value="" type="text" placeholder="Username"> </div> <div class="form-group"> <label class="hidden" for="login_password">Password</label> <input name="password" id="login_password" class="form-control" value="" type="password" placeholder="Password"> </div> <div class="form-check"> <label class="form-check-label"> <input name="rememberusername" id="rememberusername" class="form-check-input" value="1" checked="checked" type="checkbox"> Remember username</label> </div> <div class="form-group gotafe-frontpage-submit"> <div class="row"> <div class="col-sm-9"> <input class="btn btn-primary btn-block" value="Log in" type="submit"> </div> <div class="col-sm-3 text-right"> <p class="text-right"><small><a href="/forgot_password.php">Forgot password?</a></small></p> </div> </div> </div> </form> </div>';
    // var snip = 'Inject login form here';
    $('#page-mast .snap-login-button').before(snip);
    $('#page-mast .snap-login-button').hide();
});
</script>