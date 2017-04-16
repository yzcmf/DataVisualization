import React from 'react';
import { Accordion, Panel, ButtonToolbar, Button } from 'react-bootstrap';

export const RecipeList = ({ recipes, handleDeleteRecipe, handleEditRecipe }) =>
  <Accordion>
    { recipes.map(recipe =>
      <Panel key={recipe.id} eventKey={recipe.id} header={recipe.name}>
        <IngredientList ingredients={recipe.ingredients} />
        <ActionButtons handleDeleteRecipe={handleDeleteRecipe} 
                       handleEditRecipe={handleEditRecipe} 
                       recipeId={recipe.id}
        />
      </Panel>
    )}
  </Accordion>

const IngredientList = ({ ingredients }) =>
  <div className="ingredientList">
    <h2>Ingredients</h2>
    <ul>
      { ingredients.map(ingredient =>
        <li key={ingredient.id}>{ingredient.name}</li>
      )}
    </ul>
  </div>

const ActionButtons = ({ handleDeleteRecipe, handleEditRecipe, recipeId }) =>
  <ButtonToolbar>
    <Button bsStyle="success"
            type="button"
            onClick={() => handleEditRecipe(recipeId)}>
      Edit
    </Button>
    <Button bsStyle="danger" 
            type="button" 
            onClick={() => handleDeleteRecipe(recipeId)} >
      Delete
    </Button>
  </ButtonToolbar>