import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../ultils/userContext";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";
export const WishlistContext = createContext();


export const WishlistProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    if (user && user.user && user.user.id) {
      const storedWishlist = localStorage.getItem(`wishlist_${user.user.id}`);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [user]);


  useEffect(() => {
    if (user && user.user && user.user.id) {
      localStorage.setItem(
        `wishlist_${user.user.id}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, user]);


  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {
      const isBookInWishlist = prevWishlist.some(
        (item) => item.bookID === book.bookID
      );
      if (isBookInWishlist) {
        toast.info("Sách đã có trong wishlist!");
        return prevWishlist;
      }
      toast.success("Sách đã được thêm vào wishlist!");
      return [...prevWishlist, book];
    });
  };


  const removeFromWishlist = (bookID) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((book) => book.bookID !== bookID)
    );
    toast.success("Sách đã được xóa khỏi wishlist");
  };
  console.log("wishlist", wishlist);
  const clearWishlist = () => {
    setWishlist([]);
  };


  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
