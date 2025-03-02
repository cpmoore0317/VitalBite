// RecipePage.tsx updated to integrate the SearchBar component and implement search functionality.

"use client";

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";

const RecipePage: React.FC = () => {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/recipes?uid=${session.user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            setRecipes(data);
          } else {
            setRecipes([]);
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) fetchRecipes();
  }, [session?.user?.id]);

  // Function to handle recipe deletion
  const handleDeleteRecipe = (recipeId: number) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.recipeId !== recipeId)
    );
  };

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((recipe) => {
    const ingredientsString = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(" ") : recipe.ingredients;
    const instructionsString = Array.isArray(recipe.instructions) ? recipe.instructions.join(" ") : recipe.instructions;
    return (
      recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredientsString.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructionsString.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort recipes after they've been fetched
  const sortedRecipes = filteredRecipes
    ? [...filteredRecipes].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center mb-12">
        <img
          src="/images/branch.png"
          alt="Branch image"
          className="w-60 h-60"
          style={{
            marginTop: "-45px",
            marginBottom: "-15px",
            alignItems: "center",
          }}
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-6 font-playfair">
          My Recipes
        </h1>

        <SearchBar placeholder="Search Recipes..." onSearch={handleSearch} />

        {loading ? (
          <p>Loading...</p>
        ) : sortedRecipes.length === 0 ? (
          <p>No recipes saved yet. Start adding some!</p>
        ) : (
          sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipeId}
              recipeId={recipe.recipeId}
              prepTime={recipe.prepTime}
              timestamp={recipe.timestamp}
              recipeName={recipe.recipeName}
              ingredients={recipe.ingredients}
              instructions={recipe.instructions}
              onDelete={handleDeleteRecipe}
              uid={session?.user?.id || ''}
            />
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default RecipePage;
