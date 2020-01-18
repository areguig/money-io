package io.github.areguig.moneyio.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

import io.github.areguig.moneyio.domain.enumeration.Currency;

import io.github.areguig.moneyio.domain.enumeration.Owner;

/**
 * A Debt.
 */
@Entity
@Table(name = "debt")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Debt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "currency", nullable = false)
    private Currency currency;

    @Column(name = "comment")
    private String comment;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "owner", nullable = false)
    private Owner owner;

    @NotNull
    @Column(name = "closed", nullable = false)
    private Boolean closed;

    @NotNull
    @Column(name = "created", nullable = false)
    private LocalDate created;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("debts")
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("debts")
    private Contact contact;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public Debt amount(Double amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public Debt currency(Currency currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public String getComment() {
        return comment;
    }

    public Debt comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Owner getOwner() {
        return owner;
    }

    public Debt owner(Owner owner) {
        this.owner = owner;
        return this;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Boolean isClosed() {
        return closed;
    }

    public Debt closed(Boolean closed) {
        this.closed = closed;
        return this;
    }

    public void setClosed(Boolean closed) {
        this.closed = closed;
    }

    public LocalDate getCreated() {
        return created;
    }

    public Debt created(LocalDate created) {
        this.created = created;
        return this;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Debt dueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public User getUser() {
        return user;
    }

    public Debt user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Contact getContact() {
        return contact;
    }

    public Debt contact(Contact contact) {
        this.contact = contact;
        return this;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Debt)) {
            return false;
        }
        return id != null && id.equals(((Debt) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Debt{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", currency='" + getCurrency() + "'" +
            ", comment='" + getComment() + "'" +
            ", owner='" + getOwner() + "'" +
            ", closed='" + isClosed() + "'" +
            ", created='" + getCreated() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            "}";
    }
}
