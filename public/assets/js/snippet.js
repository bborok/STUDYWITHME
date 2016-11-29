// $('#start_time').timepicker();
	$('#start_date').datepicker({
		format: 'M/dd/yyyy',
		todayBtn: 'linked',
		todayHighlight: true,
		autoclose: true,
		beforeShowDay: function(date) {
			var retVal = {
				enabled: true,
				classes: "",
				tooltip: ""
			}
			// if date is less than today, disable
			if (date.getTime() < Date.now()) {
				retVal.enabled = false
			}
			// enable if date is today
			let today = new Date()
			if (date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
				retVal.enabled = true
			}
			// disable if more than 6 days ahead
			let maxDate = Date.now() + (6 * 24 * 3600 * 1000)
			if (date.getTime() > maxDate) {
				retVal.enabled = false
			}

			return retVal
		}
	});

	// let min_date = new Date()
	// let max_timestamp = Date.now() + (6 * 24 * 3600 * 1000) // 6 days from now
	// var max_date = new Date()
	// max_date.setTime(max_timestamp)

	// // specify minimum date
	// let min_mth = (min_date.getMonth()+1 < 10) ? "0"+(min_date.getMonth()+1) : (min_date.getMonth()+1) //getMonth() is zero-indexed
	// let min_day = (min_date.getDate() < 10) ? "0"+min_date.getDate() : min_date.getDate()
	// let min_date_val = min_date.getFullYear() + "-" + min_mth + "-" + min_day

	// // specify maximum date
	// let max_mth = (max_date.getMonth()+1 < 10) ? "0"+(max_date.getMonth()+1) : (max_date.getMonth()+1) //getMonth() is zero-indexed
	// let max_day = (max_date.getDate() < 10) ? "0"+max_date.getDate() : max_date.getDate()
	// let max_date_val = max_date.getFullYear() + "-" + max_mth + "-" + max_day
	
	// // set min and max dates for datepicker
	// // document.getElementById('start_date').min = min_date_val
	// document.getElementById('start_date').value = min_date_val
	// // document.getElementById('start_date').max = max_date_val

	// // specify minimum time
	// let min_hrs = min_date.getHours() < 10 ? "0"+min_date.getHours() : min_date.getHours()
	// let min_mins = min_date.getMinutes() < 10 ? "0"+min_date.getMinutes() : min_date.getMinutes()

	// document.getElementById('start_time').value = min_hrs + ":" + min_mins