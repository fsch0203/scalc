chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('popup.html',{
		id: 'MyWindowID',
		bounds:{
			width: 640,
			height: 580,
			left: 100,
			top: 100
		},
		minWidth: 640,
		minHeight: 580
	});
});