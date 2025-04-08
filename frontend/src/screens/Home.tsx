import CategoryFilter from "../components/CategoryFilter";
import Booklist from "../components/booklist";
import Header from "../components/Header";
import { useState } from "react";
import CartSummary from "../components/CartSummary";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 

  return (
    <>
      <AuthorizeView>
        <span>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>{' '}
        </span>
        <Header />
        <CartSummary />
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
            <div className="col-md-9">
              <Booklist selectedCategories={selectedCategories} />
            </div>
          </div>
        </div>
      </AuthorizeView>
    </>
  );
}

export default Home;

