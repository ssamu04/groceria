import { NotepadText } from "lucide-react";
import { Link } from "react-router";

const EmptyGroceryList = () => {
  return (

    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <NotepadText className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">No grocery lists yet</h3>
      <p className="text-base-content/70">
        Ready to shop? Create your first grocery list to get started on your journey.
      </p>
      <Link to="/create" className="btn btn-primary">
        Create Your First Grocery List
      </Link>
    </div>

  );
};
export default EmptyGroceryList;