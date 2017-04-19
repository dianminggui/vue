//localStorage
var storage = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var filterTask = {
				all:function(list){
					return list;
				},
				notFinish:function(list){
					return list.filter(function(item){
						return ! item.finish;
					});
				},
				finished:function(list){
					return list.filter(function(item){
						return item.finish;
					});
				}
			};
//数据

var datas = {
	list : storage.fetch('list'),
	todo : '',
	editTasking : '',
	beforeTodo : '',
	locationHash:'all'
};

//vm实例
var vm = new Vue({
	el:'#main',
	data:datas,
	watch:{
		list:{
			handler(val){
				storage.save('list',val);
			},
			deep:true
		}
	},
	methods: {
		addTask(event) {

			//this.list.push({taskName:event.target.value});一种写法直接获取dom的value值

			if(this.todo) {
			//第二种写法在input使用v-model使得表单相应value绑定todo变量,这样只需要操作todo即可
				this.list.push({taskName : this.todo,finish : false});
				this.todo = '';
			}
		},
		deleteTask(item,event) {
			//若事件处理函数还要传其他参数,对于event可以在事件调用时传入$event访问到
			console.log(event.target.type);
			var index = this.list.indexOf(item);
			this.list.splice(index,1);
		},
		editing(item) {
			this.editTasking = item;
			this.beforeTodo = item.taskName;
		},
		edited(item){
			this.editTasking = '';
		},
		cancel(item){
			item.taskName = this.beforeTodo;
			this.beforeTodo = '';
			this.editTasking = '';
		}
	},
	directives: {//自定义指令
		"focus": {
			update(el,binding) {//钩子函数update,
				if (binding.value) {//binding.value是指令的绑定值,在html上是v-focus="editTasking === item"中"editTasking === item"的值
					el.focus();
				}
			}
		}
	},
	computed:{
		notFinishTask:function(){
			return this.list.filter(function(item){
				return ! item.finish;
			}).length;
		},
		filterList:function(){//计算属性不要写在data里
			return filterTask[this.locationHash] ? filterTask[this.locationHash](this.list) : this.list
		}	
	}
});

function watchHashchange(){
	var hash = window.location.hash.slice(1);
	console.log(hash);
	vm.locationHash = hash;
}

watchHashchange();
window.addEventListener('hashchange',watchHashchange);

