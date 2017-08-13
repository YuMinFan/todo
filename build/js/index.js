/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	var task_list = [];
	var flag = 0;


	init();				//初始化
	addTask();			//回车添加任务
	clearCompleted();
	
	chooseAll();
	showBtn();



/*-----------初始化--------------*/
function init(){
	task_list = store.get('tasks') || [];
	flag = store.get('flag') || 0;

	addTaskList();			//添加任务列表
	editTask();
	delTask();
	count();
	choose();
}



/*-----------回车添加任务--------------*/
function addTask(){
	// $('.new-todo').off('keydown');			
	$('.new-todo').on('keydown',function(ev){
		var key = ev.which;			//获取按下去的取值

		if(key == 13){
			var obj = {};
			obj.content = $(this).val();
			var reg = /.*[^ ].*/;	//正则匹配非空
			if (!reg.test(obj.content)) return;
			add_task(obj);
			$(this).val(null);
			init();
		}
	})

}
/*-----------添加单条任务进数组与本地--------------*/
function add_task(obj){
	task_list.push(obj);
	store.set('tasks',task_list);
}
/*-----------添加任务列表--------------*/
function addTaskList(){
	var $todo_list = $('.todo-list');
	var $filters_a = $('.filters a');
	var str = [];

	$todo_list.html(null);
	$filters_a.removeClass('selected');
	if(task_list.length == 0){
		$('.main').hide();
		$('.footer').hide();
	}else{
		$('.main').show();
		$('.footer').show();
	}
	$(task_list).each(function(index,ele){
		switch(flag){
			case 0 :
				$filters_a.eq(0).attr('class','selected');
				str = taskHtml(index,ele);
				$todo_list.prepend(str);
				break;
			case 1 :
				$filters_a.eq(1).attr('class','selected');
				if(!ele.completed){
					str = taskHtml(index,ele);
					$todo_list.prepend(str); 
				}
				break;
			case 2 :
				$filters_a.eq(2).attr('class','selected');
				if(ele.completed){
					str = taskHtml(index,ele);
					$todo_list.prepend(str); 
				}
				break;

		}
	})


}
/*-----------添加html--------------*/
function taskHtml(index,ele){
	var str = '<li data-index="'+(index)+'" class='+(ele.completed ? "completed" : "")+'>'+
					'<div class="view">'+
					'<input class="toggle" type="checkbox" '+(ele.completed ? "checked" : "")+'>'+
					'<label>'+ ele.content +'</label>'+
					'<button class="destroy"></button>'+
					'</div>'+
					'<input class="edit" value="'+ ele.content +'">'+
					'</li>';
	return str;
}
/*-----------点击任务编辑--------------*/
function editTask(){
	$('.todo-list li').off('dblclick');
	$('.todo-list li').on('dblclick',function(){
		$(this).addClass('editing');
		var $edit = $(this).find('.edit');
		$edit.focus().val($edit.val());
		$edit.on('blur',function(){
			$edit.parent().removeClass('editing');
			var index = $(this).parent().data('index');
			task_list[index].content = $(this).val();
			store.set('tasks',task_list);
			init();
		})
		$edit.on('keydown',function(ev){
			var key = ev.which;
			if(key == 13){
				$edit.parent().removeClass('editing');
				var index = $(this).parent().data('index');
				task_list[index].content = $(this).val();
				stroe.set('tasks',task_list);
				init();
			}
		})
	})
}
/*-----------删除任务--------------*/
function delTask(){
	$('.destroy').click(function(){
		var index = $(this).parent().parent().data('index');
		// console.log(index);
		task_list.splice(index,1);
		store.set('tasks',task_list);
		init();
	})
}
/*-----------选择单选框--------------*/
function choose(){
	$('.toggle').click(function(){
		var index = $(this).parent().parent().data('index');
		if(task_list[index].completed){
			task_list[index].completed = false;
		}else{
			task_list[index].completed = true;
		}
		store.set('tasks',task_list);
		init();
	})
}
/*-----------判断是否全选--------------*/
function count(){
	var count = 0;
	for(var i=0 ; i<task_list.length ; i++){
		if(task_list[i].completed){
			count++;
		}
	}
	var sum = task_list.length - count;
	$('.todo-count strong').text(sum);
	if(count == 0){
		$('.clear-completed').hide();
	}else{
		$('.clear-completed').show();
	}
	var $checkAll = $('#toggle-all');
	if(task_list.length == count){
		$checkAll.prop('checked','true');
	}else{
		$checkAll.prop('checked',null);
	}
}
/*-----------选择所有选择框--------------*/
function chooseAll(){
	$('#toggle-all').bind('click',function(){
		for(var i=0 ; i<task_list.length ; i++){
			if($(this).prop('checked')){
				task_list[i].completed = true;
			}else{
				task_list[i].completed = false;
			}
		}
		store.set('tasks',task_list);
		init();
	})
}
/*-----------显示按钮--------------*/
function showBtn(){
	$('.filters a').on('click',function(){
		var index = $(this).parent().index();
		store.set('flag',index);
		init();
	})
}
/*-----------清空完成任务--------------*/
function clearCompleted(){
	$('.clear-completed').on('click',function(){
		for(var i=0 ; i<task_list.length ; i++){
			if(task_list[i].completed){
				task_list.splice(i,1);
				i = i - 1;
			}
		}
		store.set('tasks',task_list);
		init();
	})
}







	
});


