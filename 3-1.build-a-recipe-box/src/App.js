import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import logo from './logo.svg';
import { LIST_OF_RECIPES } from './data';
import { RecipeList } from './components/Lists';
import { NewRecipeModal } from './components/RecipeModal';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipes: LIST_OF_RECIPES,
      newRecipe: {
        id: "",
        name: "",
        ingredients: [],
      },
      newRecipeModal: false,
      numberOfRecipes: 2,
    };
    this.openNewRecipeForm = this.openNewRecipeForm.bind(this);
    this.closeNewRecipeForm = this.closeNewRecipeForm.bind(this);
    this.handleFormNameChange = this.handleFormNameChange.bind(this);
    this.handleFormIngredientsChange = this.handleFormIngredientsChange.bind(this);
    this.submitNewRecipe = this.submitNewRecipe.bind(this);
    this.handleDeleteRecipe = this.handleDeleteRecipe.bind(this);
    this.handleEditRecipe = this.handleEditRecipe.bind(this);
  }

  openNewRecipeForm() {
    this.setState({ newRecipeModal: true });
  }

  closeNewRecipeForm() {
    this.setState({ newRecipeModal: false });
  }

  handleFormNameChange(recipeId, event) {
    const value = event.target.value;//update now
    this.setState({
      newRecipe: {
        id: recipeId,
        name: value,
        ingredients: this.state.newRecipe.ingredients,
      }
    });
  }

  handleFormIngredientsChange(recipeId, event) {
    const value = event.target.value.split(',');
    this.setState({
      newRecipe: {
        id: recipeId,
        name: this.state.newRecipe.name,
        ingredients: value,
      }
    });
  }

  buildIngredientsObjectFromArray(array) {
    return array.map((item, index) => {
      let obj = {};
      obj.id = index;
      obj.name = item;
      return obj;
    });
  }

  addRecipe(recipeList, newRecipe) {
    recipeList.push(newRecipe);
  }

  handleDeleteRecipe(recipeId) {
    const currentRecipeList = this.state.recipes;
    const updatedRecipeList = currentRecipeList.filter(recipe => recipe.id !== recipeId);
    this.setState({
      recipes: updatedRecipeList,
    })
  }

  handleEditRecipe(recipeId) {
    const recipe = this.state.recipes.find(recipe => recipe.id === recipeId);

    if (recipe) {
      this.setState({
        newRecipe: {
          id: recipe.id,
          name: recipe.name,
          ingredients: [...recipe.ingredients.map(ingredient => ingredient.name)],
        },
        newRecipeModal: true,
      });
    } else {
      this.setState({
        newRecipeModal: true,
      })
    }
  }

  getRecipeFromId(recipeId) {
    let recipe = this.state.recipes.find(recipe => recipe.id === recipeId);
    if (!recipe) {
      recipe = this.state.newRecipe;
      recipe.id = this.state.currentlyEditingRecipeId;
    }
    return recipe;
  }

  getIndexFromArray(recipeId, latestRecipeId, array) {
    // Decide if we are adding a new recipe or creating a new one.
    let index = array.findIndex(recipe => recipe.id === recipeId);
    if (index === -1) {
      // We minus 1 here because push() returns the length of the array.
      // So we want to later update the length - 1 element in the array,
      // which is the last element in the array.
      index = array.push({
        id: latestRecipeId + 1,
      }) - 1;
    }
    return index;
  }

  updateRecipeToList(index, newRecipe, list) {
    const ingredients = this.buildIngredientsObjectFromArray(newRecipe.ingredients);

    list[index].name = newRecipe.name;
    list[index].ingredients = ingredients;
    return list;
  }

  submitNewRecipe(recipeId) {
    const newRecipeList = [...this.state.recipes];
    const latestRecipeId = this.state.numberOfRecipes;
    const recipeIndex = this.getIndexFromArray(recipeId, latestRecipeId, newRecipeList);
    this.updateRecipeToList(recipeIndex,
                              this.state.newRecipe,
                              newRecipeList);

    this.setState({
      recipes: newRecipeList,
      newRecipe: {
        id: "",
        name: "",
        ingredients: [],
      },
      newRecipeModal: false,
      numberOfRecipes: latestRecipeId + 1,
    });
  }

  render() {
    const { recipes } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <RecipeList recipes={recipes} handleDeleteRecipe={this.handleDeleteRecipe} handleEditRecipe={this.handleEditRecipe} />
        <Button bsStyle="primary"
                bsSize="large"
                onClick={this.openNewRecipeForm}
        >
          Add New Recipe
        </Button>
        <NewRecipeModal heading="Add New Recipe"
                        showModal={this.state.newRecipeModal/*this might be redundant with recipeId now being passed*/}
                        hideModal={this.closeNewRecipeForm}
                        handleFormSubmit={this.submitNewRecipe}
                        newRecipe={this.state.newRecipe}
                        handleFormNameChange={this.handleFormNameChange}
                        handleFormIngredientsChange={this.handleFormIngredientsChange}
        />
      </div>
    );
  }
}

export default App;
