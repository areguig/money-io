package io.github.areguig.moneyio.repository;

import io.github.areguig.moneyio.domain.Contact;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Contact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("select contact from Contact contact where contact.user.login = ?#{principal.username}")
    List<Contact> findByUserIsCurrentUser();

}
