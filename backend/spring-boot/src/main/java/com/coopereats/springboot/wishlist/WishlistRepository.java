//package com.coopereats.springboot.wishlist;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
//    List<Wishlist> findByUserId(Long userId);
//}
package com.coopereats.springboot.wishlist;

import com.coopereats.springboot.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Correct the method to use 'user.id' for referencing the user's ID
    Wishlist findByUser(User user);
}
