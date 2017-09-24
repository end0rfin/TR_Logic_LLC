// Данные по умолчанию
var default_tovar_nakladnaya = [
			{ id: 1, name: 'Свежая картошка',count: 2.5, price: 150},
			{ id: 2, name: 'Помидоры',		 count: 6,	 price: 350},
			{ id: 3, name: 'Живая курица',	 count: 8.3, price: 620.5},
		];

// Локальное хранилище товаров накладной
	// Имя хранилища
var TOVARS_STORAGE_KEY = 'tovar_nakladnaya_storage_key'

	// Обработка локального хранилища - получение и сохранение 
var tovar_storage = {
  fetch: function () {
    var tovars = JSON.parse(localStorage.getItem(TOVARS_STORAGE_KEY) || '[]')

	// Если локально нет товарной накладной - загружаем по умолчанию
	if (tovars.length < 1) {
		localStorage.setItem(TOVARS_STORAGE_KEY, JSON.stringify(default_tovar_nakladnaya));
		tovars = JSON.parse(localStorage.getItem(TOVARS_STORAGE_KEY) || '[]')
	}

    tovars.forEach(function (tovar, index) {
		tovar.id = index
    })
    tovar_storage.uid = tovars.length
    return tovars
  },
  save: function (tovar) {
    localStorage.setItem(TOVARS_STORAGE_KEY, JSON.stringify(tovar))
  }
}


// Компонент приложения "Товарная накладная"
var app = new Vue({
  data: {
    tovars: tovar_storage.fetch(),
    // Объект нового товара
    new_tovar: [{
    	id: '',
    	name: '',
    	count: '',
    	price: '',
    }],
    // Метки редактируемых полей
    editedTovar: {name: false,count: false,price: false},
    editedTovar_item: null,
  },


  watch: {
    tovars: {
      handler: function (tovars) {
        tovar_storage.save(tovars)
      },
      deep: true
    }
  },


  computed: {
    itogo_price: function () {
    	let tovars = this.tovars;
    	let res = 0;
    	for (var i = 0; i < tovars.length; i++) {
    		res = res + +(tovars[i].price)
    	}
    	return res
    }
  },




  methods: {
    addTovar: function () {
    	var value = this.new_tovar
    	if (!value) {
			return
		}
		this.tovars.push({
			id: tovar_storage.uid++,
	    	name: this.new_tovar.name,
	    	count: this.new_tovar.count,
	    	price: this.new_tovar.price
		})
		this.new_tovar = { id: '', name: '',count: '',price: '' }
    },
    removeTovar: function (tovar) {
      this.tovars.splice(this.tovars.indexOf(tovar), 1)
    },
    editTovar: function (tovar,field) {
		this.beforeEditCache = tovar[field]
		this.editedTovar_item = tovar
      	// this.editedTovar_item = tovar[field]
      	this.editedTovar.name = (field == 'name')?true:false;
      	this.editedTovar.count = (field == 'count')?true:false;
      	this.editedTovar.price = (field == 'price')?true:false;
		this.beforeEditCache = tovar.name
	},
    doneEdit: function (tovar) {
      if (!this.editedTovar_item) {
        return
      }
      this.editedTovar_item = null
    },

    cancelEdit: function (tovar) {
      this.editedTovar_item = null
    },
  },

  directives: {
    'tovar-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }

})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

// window.addEventListener('hashchange', onHashChange)
// onHashChange()

// mount
app.$mount('#app_nakladnaya')
