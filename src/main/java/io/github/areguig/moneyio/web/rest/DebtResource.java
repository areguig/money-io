package io.github.areguig.moneyio.web.rest;

import io.github.areguig.moneyio.domain.Debt;
import io.github.areguig.moneyio.repository.DebtRepository;
import io.github.areguig.moneyio.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link io.github.areguig.moneyio.domain.Debt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DebtResource {

    private final Logger log = LoggerFactory.getLogger(DebtResource.class);

    private static final String ENTITY_NAME = "debt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DebtRepository debtRepository;

    public DebtResource(DebtRepository debtRepository) {
        this.debtRepository = debtRepository;
    }

    /**
     * {@code POST  /debts} : Create a new debt.
     *
     * @param debt the debt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new debt, or with status {@code 400 (Bad Request)} if the debt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/debts")
    public ResponseEntity<Debt> createDebt(@Valid @RequestBody Debt debt) throws URISyntaxException {
        log.debug("REST request to save Debt : {}", debt);
        if (debt.getId() != null) {
            throw new BadRequestAlertException("A new debt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Debt result = debtRepository.save(debt);
        return ResponseEntity.created(new URI("/api/debts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /debts} : Updates an existing debt.
     *
     * @param debt the debt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated debt,
     * or with status {@code 400 (Bad Request)} if the debt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the debt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/debts")
    public ResponseEntity<Debt> updateDebt(@Valid @RequestBody Debt debt) throws URISyntaxException {
        log.debug("REST request to update Debt : {}", debt);
        if (debt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Debt result = debtRepository.save(debt);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, debt.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /debts} : get all the debts.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of debts in body.
     */
    @GetMapping("/debts")
    public ResponseEntity<List<Debt>> getAllDebts(Pageable pageable) {
        log.debug("REST request to get a page of Debts");
        Page<Debt> page = debtRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /debts/:id} : get the "id" debt.
     *
     * @param id the id of the debt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the debt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/debts/{id}")
    public ResponseEntity<Debt> getDebt(@PathVariable Long id) {
        log.debug("REST request to get Debt : {}", id);
        Optional<Debt> debt = debtRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(debt);
    }

    /**
     * {@code DELETE  /debts/:id} : delete the "id" debt.
     *
     * @param id the id of the debt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/debts/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        log.debug("REST request to delete Debt : {}", id);
        debtRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
