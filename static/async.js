var active_scan_timer;
var wmover = false;
var wmopen = false;
var navbarvisible = false;
$(document).ready(function() {
	// doc ready

	$(document).scroll(function() {
		// console.log($(this).scrollTop());
		if($(this).scrollTop() > 10) {
			if(!navbarvisible) {
				navbarvisible = true;
				$('#topnavbar').css('background-color','rgba(10,10,10,0.9)');
				$('#topnavbar').css('box-shadow','4px 4px 6px #000');
			}
		}

		if($(this).scrollTop() <= 10) {
			if(navbarvisible) {
				navbarvisible = false;
				$('#topnavbar').css('background-color','rgba(10,10,10,0.2)');
				$('#topnavbar').css('box-shadow','none');
			}
		}
	});

	active_scan_timer = setInterval(function() { checkActiveScan(); }, 2000);
	$('select').formSelect();


	var wminterval = setInterval(function() {
		if(!wmover) {
			$('.wm_menu').animate({
				width:'44px'
			}, {
				queue:false,
				start: function() {
					$('.wm_menu > ul > li > a').each(function() { $(this).css('display','none'); });
					$('.wm_menu > ul > section > li > a').each(function() { $(this).css('display','none'); });
				},
				done: function() {
					wmopen = false;
					$('.wm_menu').scrollTop(0);
					$('.wm_menu').css('overflow-y','hidden');
				}
			});
		}
	}, 2000);

	$('.wm_menu').css('height', ($(window).height()-120)+'px');

	$('.wm_menu').click(function() {
		wmover = true;
		wmopen = true;

		$(this).animate({
			width:'240px'
		}, {
			queue:false,
			done: function() {
				$('.wm_menu > ul > li > a').each(function() { $(this).stop().show(); });
				$('.wm_menu > ul > section > li > a').each(function() { $(this).stop().show(); });
				$('.wm_menu').css('overflow-y','scroll');
			}
		});
	});

	$('.wm_menu').mouseover(function() {
		wmover = true;
		if(!wmopen) {
			$(this).stop().animate({width:'60px'},{duration:50});
		}
	});

	$('.wm_menu').mouseout(function() {
		if(wmover) {
			wmover = false;
		}
		if(!wmopen) {
			$(this).stop().animate({width:'44px'},{duration:200});
		}
	});

});

function checkActiveScan() {
	$.get('/api/v1/nmap/scan/active').done(function(d) {
		// console.log(d);
		$('#activescan_info').html('');
		var c = 0;
		for(i in d['scans']) {
			c = (c + 1);
			if(d['scans'][i]['status'] == 'active') {

				$('#activescan_line').css('display','block');
				$('#activescan_info').css('display','block');
				$('#activescan_progress').css('display','block');
				$('#activescan_info').append('<li>'+
					'<i class="fas fa-info-circle"></i> '+
					'<a href="#!">'+i+'</a>'+
				'</li>'+
				'<li>'+
					'<i class="material-icons">keyboard_arrow_right</i> '+
					'<a href="#!">'+d['scans'][i]['startstr']+'</a>'+
				'</li>'+
				'<li>'+
					'<i class="material-icons">keyboard_arrow_right</i> '+
					'<a href="#!">'+d['scans'][i]['type']+' '+d['scans'][i]['protocol']+'</a>'+
				'</li>');
				
				if(wmover && wmopen) {
					$('.wm_menu > ul > li > a').each(function() {
						$(this).stop().show();
					});
					$('.wm_menu > ul > section > li > a').each(function() {
						$(this).stop().show();
					});
				}
			} else {

				$('#activescan_line').css('display','block');
				$('#activescan_info').css('display','block');
				$('#activescan_info').append('<li>'+
					'<i class="fas fa-info-circle"></i> '+
					'<a href="#!">'+i+'</a>'+
				'</li>'+
				'<li>'+
					'<i class="material-icons">keyboard_arrow_right</i> '+
					'<a href="#!">'+d['scans'][i]['startstr']+'</a>'+
				'</li>'+
				'<li>'+
					'<i class="material-icons">keyboard_arrow_right</i> '+
					'<a href="#!">'+d['scans'][i]['type']+' '+d['scans'][i]['protocol']+'</a>'+
				'</li>');
				$('#activescan_progress').css('display','none');

				if(wmover && wmopen) {
					$('.wm_menu > ul > li > a').each(function() { $(this).stop().show(); });
					$('.wm_menu > ul > section > li > a').each(function() { $(this).stop().show(); });
				}

				//swal("Done!", "Your Nmap scan is done. reload this page...", "success");
				//setTimeout(function() { location.reload(); }, 5000);
			}
		}

		if(c <= 0) {
			$('#activescancard').css('display','none');
		}
	});
}

function newscan() {
	$('#modaltitle').html('<i class="material-icons">wifi_tethering</i> 创建Nmap扫描');
	$('#modalbody').html(
		'通过设置以下3个参数来运行新的Nmap扫描:'+
		'<div class="input-field">'+
		'	<div class="small">'+
		'		<div style="padding:20px;">'+
		'		<b>文件名:</b><br>Nmap XML文件名. 此项必填 <code class="language-markup">.xml</code> extension.<br>规则: <code>[a-zA-Z0-9], _, - 和 .</code><br><br>'+
		'		<b>IP/Hostname:</b><br>可以是IP地址或者主机名<br><br>'+
		'		<div>'+
		'	</div>'+
		'<br>'+
		'	<input placeholder="XML 文件名 (ex. my_scan.xml)" id="xmlfilename" type="text" class="validate">'+
		'	<input placeholder="IP / hostname (ex. 192.168.1.0/24)" id="targethost" type="text" class="validate">'+
		''+
		'	<br><br>'+
		'	<div class="row">'+
		'		<div class="col s4 grey-text darken-3"><h6>定时开启:</h6></div>'+
		'		<div class="col s8" style="padding:10px;"><div class="switch"><label>Off<input id="schedule" name="schedule" type="checkbox"><span class="lever"></span>On</label></div></div>'+
		'		<div class="col s12" style="border-bottom:solid 1px #ccc;margin-bottom:20px;">&nbsp;</div>'+
		'		<div class="col s4 grey-text darken-3"><h6>频率:</h6></div>'+
		'		<div class="col s8"><select id="frequency" name="frequency">'+
		'			<option value="1h">每小时</option>'+
		'			<option value="1d">每天</option>'+
		'			<option value="1w">每周</option>'+
		'			<option value="1m">每个月</option>'+
		'		</select></div>'+
		'	</div>'+
		'</div>'+
		''
	);
	$('#modalfooter').html('<button onclick="javascript:startscan();" class="btn green">Start</button>');
	$('#modal1').modal('open');
	$('select').formSelect();
}

function startscan() {
	$('#modal1').modal('close');
	csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
	$.post('/api/v1/nmap/scan/new', {
		'csrfmiddlewaretoken': csrftoken,
		'filename': $('#xmlfilename').val(),
		'target': $('#targethost').val(),
		'params': '-sT -A -T4 -oX',
		'schedule': $('#schedule').prop('checked'),
		'frequency': $('#frequency').val(),
	}).done(function(d) {
		if(typeof(d['error']) != 'undefined') {
			swal("Error", "语法无效或字符不允许", "error");
		} else {
			swal("Started", "您的新Nmap扫描正在运行...", "success");
		}
	});
}

var cpetot = 0;
var cpetimer;
function checkCVE() {
	if($('#cpestring').length <= 0) {
		M.toast({html: '请先选择一份扫描报告'});
		return 0;
	}

	cpe = JSON.parse(atob(decodeURIComponent($('#cpestring').val())));
	csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
	console.log(cpe);

	$('#modaltitle').html('寻找CVE和漏洞');
	$('#modalbody').html(
		'此过程可能需要一段时间，请稍候...'+
		'<div class="progress"><div class="indeterminate"></div></div>'
	);
	$('#modalfooter').html('');
	$('#modal1').modal('open');

	$.post('/report/api/getcve/', {
		'cpe': $('#cpestring').val(),
		'csrfmiddlewaretoken': csrftoken
	}).done(function(d) {
		console.log(d);
		$('#modalbody').html('做完了请点击“F5”按钮重新加载此页面.');
		$('#modalfooter').html('<button class="btn blue" onclick="javascript:location.reload();">Reload</button>');
	});

	return 0;
	
	cpetot = Object.keys(cpe).length;
	console.log(cpetot);

	for(host in cpe) {
		for(port in cpe[host]) {
			for(cpestr in cpe[host][port]) {
				if(/^cpe:.+:.+:.+:.*$/.test(cpestr)) {
					console.log(cpestr);
					$.post('/report/api/getcve/', {
						'cpe': cpestr,
						'host':host,
						'port':port,
						'csrfmiddlewaretoken': csrftoken
					}).done(function(d) {
						console.log(d);
						for(rhost in d) {
							for(rport in d[rhost]) {
								$('#modalbody').append('<div class="small"><i>Received: '+d[rhost][rport]['id']+' host:'+rhost+' port:'+rport+'</i></div>');
							}
						}
					}).always(function() { cpetot = (cpetot - 1); });
				} else {
					cpetot = (cpetot - 1);
				}

				console.log(cpetot);
			}
		}
	}

	cpetimer = setInterval(function() {
		if(checkCPETOT()) {
			console.log('END');
			window.clearInterval(cpetimer);
			$('#modalbody').html('做完了请单击“F5”按钮重新加载此页面.');
			$('#modalfooter').html('<button class="btn blue" onclick="javascript:location.reload();">Reload</button>');
		}
	}, 2000);
}

function checkCPETOT() {
	if(cpetot <= 0) {
		return true;
	} else {
		return false;
	}
}

function genPDF(md5scan) {
	if(/^[a-f0-9]{32,32}$/.test(md5scan)) {
		$.get('/report/api/pdf/').done(function(data) {
			console.log(data);
			// $('#modal1').css('background-color','#3e3e3e');
			$('#modaltitle').html('生成 PDF 报告');
		
			$('#modalbody').html('Please wait a few seconds...<br>'+
			'<div class="progress"><div class="indeterminate"></div></div>'+
			'<br><br>You\'ll be redirected to the PDF Report:<br>')
			$('#modal1').modal('open');
		});

		var pdfcheck = setInterval(function() {
			$.get('/static/'+md5scan+'.pdf')
			.done(function() { $('#modalbody').append('PDF ready! Please wait...<br>'); setTimeout(function() { location.href='/static/'+md5scan+'.pdf' }, 3000); })
			.fail(function() { $('#modalbody').append('<i>PDF not ready yet...</i><br>'); });
		}, 2000);
	}
}

function removeNotes(hashstr, i) {
	$.get('/report/api/rmnotes/'+hashstr+'/').done(function(data) {
		if(data['ok'] == 'notes removed') {
			$('#noteshost'+i).remove();
		}
	});
}

function saveNotes() {
	nb64 = encodeURIComponent(btoa($('#notes').val()));
	csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
	hashstr = $('#hashstr').val();
	console.log(hashstr);
	$.post('/report/api/savenotes/', {
		'notes': nb64,
		'csrfmiddlewaretoken': csrftoken,
		'hashstr': hashstr
	 }).done(function(d) {
		console.log(d);
		if(typeof(d['ok']) !== 'undefined' && d['ok'] == 'notes saved') {
			$('#modalbody').html('<span class="green-text">Notes successfully saved!</span><br> Now this page needs a reload. Please, click on the &quot;Reload&quot; button.');
			$('#modalfooter').html('<button class="btn blue" onclick="javascript:location.reload();">Reload</button>');
		}
	});
}

function openNotes(hashstr, notesb64) {
	if(/^[a-f0-9]{32,32}$/.test(hashstr)) {
		if(notesb64 != '') {
			savednotes = atob(decodeURIComponent(notesb64));
		} else {
			savednotes = ''
		}
		// $('#modal1').css('background-color','#3e3e3e');
		$('#modaltitle').html('Save Notes');
		$('#modalbody').html(
			'In the text area below, you can insert notes that will appear on the PDF report. '+
			'All input here are <b class="blue-text">intentionally not sanitized</b>, so you can use HTML markup and JavaScript. '+
			'Please, keep in mind that <b class="orange-text">you can break the PDF View HTML</b> and, of course, this represents a stored XSS vector.<br><br>'+
			'<textarea id="notes" style="min-height:160px;border-radius:4px;border:solid #ccc 1px;padding:10px;font-family:monospace;">'+$('<span/>').text(savednotes).html()+'</textarea>'+
			'<input type="hidden" id="hashstr" value="'+hashstr+'" /><br><br>'+
			'<b>Tips:</b><br>'+
			'<code class="grey-text">&lt;b&gt;bold text&lt;/b&gt;</code> = <b>bold text</b><br>'+
			'<code class="grey-text">&lt;i&gt;italic text&lt;/i&gt;</code> = <i>italic text</i><br>'+
			'<code class="grey-text">&lt;span class="label green"&gt;A green label&lt;/span&gt;</code> = <span class="label green">A green label</span><br>'+
			'<code class="grey-text">&lt;code&gt;monospace font&lt;/code&gt;</code> = <code>monospace font</code>'
		);
		$('#modalfooter').html('<button class="modal-close waves-effect waves-green btn grey">Close</button> <button onclick="javascript:saveNotes();" class="waves-effect waves-green btn green white-text">Save</button>');
		$('#modal1').modal('open');
	}
}

function apiPortDetails(address, portid) {
	$.get('/report/api/'+address+'/'+portid+'/').done(function(data) {
		console.log(data);

		$('#modaltitle').html('端口详情: <span class="blue-text">'+$('<span/>').text(data['@protocol']).html().toUpperCase()+' / '+$('<span/>').text(data['@portid']).html()+'</span>');

		tbody = ''
		ingorescriptid = {
			'fingerprint-strings':true
		}

		console.log(typeof(data['script']));
		if(typeof(data['script']) !== 'undefined') {
			if(typeof(data['script']) === 'object' && typeof(data['script']['@id']) === 'undefined') {
				for(sid in data['script']) {
					if(typeof(ingorescriptid[data['script'][sid]['@id']]) !== 'undefined') { continue; }
					tbody += '<tr><td class="orange-text">'+$('<span/>').text(data['script'][sid]['@id']).html()+'</td><td style="font-family:monospace;font-size:12px;">'+$('<span/>').text(data['script'][sid]['@output']).html()+'</td></tr>'
				}
			} else {
				if(typeof(ingorescriptid[data['script']['@id']]) === 'undefined') {
					tbody += '<tr><td class="orange-text">'+$('<span/>').text(data['script']['@id']).html()+'</td><td style="font-family:monospace;font-size:12px;">'+$('<span/>').text(data['script']['@output']).html()+'</td></tr>'
				}
			}
		} else {
			tbody += '<tr><td><i>none</i></td><td><i>none</i></td></tr>'
		}

		// $('#modal1').css('background-color','#3e3e3e');

		$('#modalbody').html('<table class="table"><thead><th style="min-width:200px;">脚本ID</th><th>输出</th></thead><tbody>'+tbody+'</tbody></table>');
		$('#modalbody').append('<br><b>原始数据输出:</b><br><pre>'+$('<span/>').text(JSON.stringify(data, null, 4)).html()+'</pre>');
		$('#modal1').modal('open');
	});
}

function removeLabel(type, hashstr, i) {
	$.get('/report/api/rmlabel/'+type+'/'+hashstr+'/').done(function(data) {
		if(data['ok'] == 'label removed') {
			$('#hostlabel'+i).attr("class","")
			$('#hostlabel'+i).html("");
			$('#hostlabelbb'+i).attr("class","")
		}
	});
}

function setLabel(type, label, hashstr, i) {
	$.get('/report/api/setlabel/'+type+'/'+label+'/'+hashstr+'/').done(function(data) {
		console.log(data);
		var res = data;
		var color = 'grey'; var margin = '10px';
		if(res['ok'] == 'label set') {

			switch(res['label']) {
				case 'Vulnerable': color = 'red'; margin = '10px'; break;
				case 'Critical': color = 'black'; margin = '22px'; break;
				case 'Warning': color = 'orange'; margin = '28px'; break;
				case 'Checked': color = 'blue'; margin = '28px'; break;
			}

			// z-index:99;transform: rotate(-8deg);margin-top:-14px;margin-left:-40px;
			$('#hostlabel'+i).css("margin-left", '-40px')
			$('#hostlabel'+i).css("z-index", '99')
			$('#hostlabel'+i).css("transform", 'rotate(-8deg)')
			$('#hostlabel'+i).css("margin-top", '-14px')
			$('#hostlabel'+i).attr("class","")
			$('#hostlabel'+i).addClass('leftlabel');
			$('#hostlabel'+i).addClass(color);
			$('#hostlabel'+i).html(res['label']);

			// border-radius:0px 4px 0px 4px;z-index:98;position:absolute;width:18px;height:10px;margin-left:-48px;margin-top:-3px;
			$('#hostlabelbb'+i).css("border-radius", '0px 4px 0px 4px')
			$('#hostlabelbb'+i).css("z-index", '98')
			$('#hostlabelbb'+i).css("position", 'absolute')
			$('#hostlabelbb'+i).css("width", '18px')
			$('#hostlabelbb'+i).css("height", '10px')
			$('#hostlabelbb'+i).css("margin-left", '-54px')
			$('#hostlabelbb'+i).css("margin-top", '-3px')
			$('#hostlabelbb'+i).attr("class","")
			$('#hostlabelbb'+i).addClass(color);
		}
	});
}


