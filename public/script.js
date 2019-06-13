let app = new Vue({
  el: '#app',
  data: {
    instruction:'hello',
    instructionNum: 0,
    gameStarted: false,
    textboard:[],
    message: '',
    wordType:'',
    definition:'',
    wordInfo: {},

    door: false,
    open: false,

    moves: 0,

    user:'',
    login: false,
    items: [],
    loading: false,

    gameover: false,
  },


  methods: {

    async getWordInfo(word) {
      try
      {
        const response = await axios.get('https://dictionaryapi.com/api/v3/references/collegiate/json/' + word +'?key=65dcd250-8627-4dc9-b491-b577c7098afb');
        this.wordInfo = (response.data);

        if(word == "open")
        {
          if(this.door)
          {
            this.deleteItem();
            this.message = "Congratulations, you win!"
            this.gameStarted = false;
            this.gameover = true;
          }
          else
          {
            this.message = "what would you like to open?";
            this.open = true;
          }
        }

        else if(word == "door")
        {
          if(this.open)
          {
            this.deleteItem();
            this.message = "Congratulations, you win!"
            this.gameStarted = false;
            this.gameover = true;
          }
          else
          {
            this.message = "what would you like to do with the door?";
            this.door = true;
          }
        }

        else if(word == "listen")
        {
          this.message = "the sound is buzzing in your ear";
        }

        else if(word == "sound")
        {
          this.message = "the sound is buzzing in your ear";
        }

        else if (word == "walk")
        {
          this.message = "where would you like to walk?";
        }

        else if (word == "run")
        {
          this.message = "where would you like to run?";
        }

        else if (this.wordInfo[0].fl === undefined) {

          this.message = "I'm sorry, I do not understand.";

        }


        else if (this.wordInfo[0].fl == "noun")
        {
          this.setNounMessage(word);
        }

        else if (this.wordInfo[0].fl == "verb")
        {
          this.setVerbMessage(word);
        }

        else {
          this.message = "I'm sorry, I do not understand.";
        }

        this.textboard.push(this.message);

        this.message = '';

        if(!gameover)
        {
          this.editItem();
        }
        return true;
      }
      catch (e)
      {
        console.log(e);
        return false;
      }
    },

    async addNewItem(){
      console.log("GOT HERE");
      try {
        let result = await axios.post('/api/items', {
          user: this.user,
          textboard: this.textboard,
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getItems() {
      try {
        this.loading = true;
        let response = await axios.get("/api/items");
        console.log(response.data);
        var found = false;
        this.items = response.data;
        var length = this.items.length;
        for(i = 0; i < length; ++i)
        {
          if(this.items[i].user == this.user)
          {
            this.textboard = this.items[i].textboard;
            this.moves = this.items[i].moves;
            console.log("FOUND IT");
            found = true;
          }
        }

        if(!found)
        {
          await this.addNewItem();
        }

        this.loading = false;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async editItem() {
      console.log("EDIT!!");
      try {
        let response = await axios.put("/api/items/" + this.user.toString(), {
          user: this.user,
          textboard: this.textboard,
          moves:this.moves,
        });
        // this.findItem = null;
        // this.getItems();
        return true;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteItem() {
      console.log("DELETE CALLED");
      try {
        let response = await axios.delete("/api/items/" + this.user);
        return true;
      }
      catch (error) {
      console.log(error);
      }
    },

    async updateInstructions() {
      if(this.instructionNum == 0){
        this.instruction = 'this is a text based adventure game'
        ++ this.instructionNum;
      }
      else if(this.instructionNum == 1) {
        this.instruction = 'you must enter one word responses to solve the puzzle'
        ++ this.instructionNum;
      }
      else if(this.instructionNum == 2) {
        this.instruction = 'if you get stuck tap the hint button'
        ++ this.instructionNum;
      }
      else if(this.instructionNum == 3) {
        this.instruction = 'good luck!'
        ++ this.instructionNum;
      }
      else if(this.instructionNum == 4) {
        this.instruction = ''
        ++ this.instructionNum;

        this.textboard.push("You find yourself in a white room");
        this.textboard.push("there is nothing in the room");
        this.textboard.push("only a dim buzzing sound");
        this.textboard.push("in the corner is a door");

        await this.getItems();
        this.gameStarted = true;
      }
    },

    gameStart()
    {
      return this.gameStarted;
    },

    submit()
    {
      this.textboard.push(this.message);
      this.getWordInfo(this.message);
      ++this.moves;
    },

    loginuser()
    {
      this.login = true;
    },

    setNounMessage(word)
    {
      this.message = "There is no " + word + " here.";
    },

    setVerbMessage(word)
    {
      this.message = "You can not " + word + ".";
    },
    displayHint()
    {
      this.message = "Hint: try the door..."
      this.textboard.push(this.message);
      this.message = '';
    }
  },

  watch: {
    textboard: function (val) {
      updateScroll();
    },
  }
});

function updateScroll(){
  var element = document.getElementById("forest");
  element.scrollTop = element.scrollHeight;
}
