jQuery ->

  BackboneSyncSuper = Backbone.sync

  Backbone.sync = (method, model, options) ->

    console.log "I've been passed " + method + " with " + JSON.stringify(model) + " and options " + JSON.stringify(options)

    BackboneSyncSuper(method, model, options)

  class Item extends Backbone.Model

    defaults:
      part1: 'Hello'
      part2: 'Backbone'
  
  class List extends Backbone.Collection

    model: Item  

    localStorage: new Backbone.LocalStorage "items"

  class ItemView extends Backbone.View

    tagName: 'li'

    initialize: ->
      _.bindAll @
      @model.bind 'change', @render
      @model.bind 'remove', @unrender

    render: ->
      $(@el).html """
        <span>#{@model.get 'part1'} #{@model.get 'part2'}!</span>
        <button class="swap">swap</button>
        <button class="delete">delete</button>
      """
      @

    unrender: =>
      $(@el).remove()

    swap: ->
      @model.set
        part1: @model.get 'part2'
        part2: @model.get 'part1'

    remove: -> 
      @model.destroy()

    events:
      'click .swap': 'swap'
      'click .delete': 'remove'

  class ListView extends Backbone.View

    el: $ '#la_totale'

    self = @

    initialize: ->
      _.bindAll @
      @counter = 0
      @collection = new List
      @collection.bind 'add', @appendItem
      @render()

    render: ->
      $(@el).append '<button id="add">Add List Item</button>'
      $(@el).append '<ol></ol>'

    addItem: ->
      @counter++
      item = new Item
      item.set part2: "#{item.get 'part2'} #{@counter}"
      @collection.create item

    appendItem: (item) ->
      item_view = new ItemView model: item
      $('#la_totale ol').append item_view.render().el      

    events: 
      'click #add': 'addItem'
      'click #save': 'save'

  list_view = new ListView
      
  list_view.collection.fetch {success: (model, response) -> console.log JSON.stringify(model) }
