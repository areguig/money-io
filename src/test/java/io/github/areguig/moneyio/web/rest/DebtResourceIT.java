package io.github.areguig.moneyio.web.rest;

import io.github.areguig.moneyio.MoneyIoApp;
import io.github.areguig.moneyio.domain.Debt;
import io.github.areguig.moneyio.domain.User;
import io.github.areguig.moneyio.domain.Contact;
import io.github.areguig.moneyio.repository.DebtRepository;
import io.github.areguig.moneyio.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static io.github.areguig.moneyio.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.areguig.moneyio.domain.enumeration.Currency;
import io.github.areguig.moneyio.domain.enumeration.Owner;
/**
 * Integration tests for the {@link DebtResource} REST controller.
 */
@SpringBootTest(classes = MoneyIoApp.class)
public class DebtResourceIT {

    private static final Double DEFAULT_AMOUNT = 1D;
    private static final Double UPDATED_AMOUNT = 2D;

    private static final Currency DEFAULT_CURRENCY = Currency.AED;
    private static final Currency UPDATED_CURRENCY = Currency.AFN;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final Owner DEFAULT_OWNER = Owner.MINE;
    private static final Owner UPDATED_OWNER = Owner.THEIRS;

    private static final Boolean DEFAULT_CLOSED = false;
    private static final Boolean UPDATED_CLOSED = true;

    private static final LocalDate DEFAULT_CREATED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUE_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restDebtMockMvc;

    private Debt debt;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DebtResource debtResource = new DebtResource(debtRepository);
        this.restDebtMockMvc = MockMvcBuilders.standaloneSetup(debtResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Debt createEntity(EntityManager em) {
        Debt debt = new Debt()
            .amount(DEFAULT_AMOUNT)
            .currency(DEFAULT_CURRENCY)
            .comment(DEFAULT_COMMENT)
            .owner(DEFAULT_OWNER)
            .closed(DEFAULT_CLOSED)
            .created(DEFAULT_CREATED)
            .dueDate(DEFAULT_DUE_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        debt.setUser(user);
        // Add required entity
        Contact contact;
        if (TestUtil.findAll(em, Contact.class).isEmpty()) {
            contact = ContactResourceIT.createEntity(em);
            em.persist(contact);
            em.flush();
        } else {
            contact = TestUtil.findAll(em, Contact.class).get(0);
        }
        debt.setContact(contact);
        return debt;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Debt createUpdatedEntity(EntityManager em) {
        Debt debt = new Debt()
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .comment(UPDATED_COMMENT)
            .owner(UPDATED_OWNER)
            .closed(UPDATED_CLOSED)
            .created(UPDATED_CREATED)
            .dueDate(UPDATED_DUE_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        debt.setUser(user);
        // Add required entity
        Contact contact;
        if (TestUtil.findAll(em, Contact.class).isEmpty()) {
            contact = ContactResourceIT.createUpdatedEntity(em);
            em.persist(contact);
            em.flush();
        } else {
            contact = TestUtil.findAll(em, Contact.class).get(0);
        }
        debt.setContact(contact);
        return debt;
    }

    @BeforeEach
    public void initTest() {
        debt = createEntity(em);
    }

    @Test
    @Transactional
    public void createDebt() throws Exception {
        int databaseSizeBeforeCreate = debtRepository.findAll().size();

        // Create the Debt
        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isCreated());

        // Validate the Debt in the database
        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeCreate + 1);
        Debt testDebt = debtList.get(debtList.size() - 1);
        assertThat(testDebt.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testDebt.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testDebt.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testDebt.getOwner()).isEqualTo(DEFAULT_OWNER);
        assertThat(testDebt.isClosed()).isEqualTo(DEFAULT_CLOSED);
        assertThat(testDebt.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testDebt.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    public void createDebtWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = debtRepository.findAll().size();

        // Create the Debt with an existing ID
        debt.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        // Validate the Debt in the database
        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtRepository.findAll().size();
        // set the field null
        debt.setAmount(null);

        // Create the Debt, which fails.

        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCurrencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtRepository.findAll().size();
        // set the field null
        debt.setCurrency(null);

        // Create the Debt, which fails.

        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkOwnerIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtRepository.findAll().size();
        // set the field null
        debt.setOwner(null);

        // Create the Debt, which fails.

        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkClosedIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtRepository.findAll().size();
        // set the field null
        debt.setClosed(null);

        // Create the Debt, which fails.

        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtRepository.findAll().size();
        // set the field null
        debt.setCreated(null);

        // Create the Debt, which fails.

        restDebtMockMvc.perform(post("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDebts() throws Exception {
        // Initialize the database
        debtRepository.saveAndFlush(debt);

        // Get all the debtList
        restDebtMockMvc.perform(get("/api/debts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(debt.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].owner").value(hasItem(DEFAULT_OWNER.toString())))
            .andExpect(jsonPath("$.[*].closed").value(hasItem(DEFAULT_CLOSED.booleanValue())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getDebt() throws Exception {
        // Initialize the database
        debtRepository.saveAndFlush(debt);

        // Get the debt
        restDebtMockMvc.perform(get("/api/debts/{id}", debt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(debt.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.owner").value(DEFAULT_OWNER.toString()))
            .andExpect(jsonPath("$.closed").value(DEFAULT_CLOSED.booleanValue()))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDebt() throws Exception {
        // Get the debt
        restDebtMockMvc.perform(get("/api/debts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDebt() throws Exception {
        // Initialize the database
        debtRepository.saveAndFlush(debt);

        int databaseSizeBeforeUpdate = debtRepository.findAll().size();

        // Update the debt
        Debt updatedDebt = debtRepository.findById(debt.getId()).get();
        // Disconnect from session so that the updates on updatedDebt are not directly saved in db
        em.detach(updatedDebt);
        updatedDebt
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .comment(UPDATED_COMMENT)
            .owner(UPDATED_OWNER)
            .closed(UPDATED_CLOSED)
            .created(UPDATED_CREATED)
            .dueDate(UPDATED_DUE_DATE);

        restDebtMockMvc.perform(put("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDebt)))
            .andExpect(status().isOk());

        // Validate the Debt in the database
        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeUpdate);
        Debt testDebt = debtList.get(debtList.size() - 1);
        assertThat(testDebt.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDebt.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testDebt.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testDebt.getOwner()).isEqualTo(UPDATED_OWNER);
        assertThat(testDebt.isClosed()).isEqualTo(UPDATED_CLOSED);
        assertThat(testDebt.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testDebt.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingDebt() throws Exception {
        int databaseSizeBeforeUpdate = debtRepository.findAll().size();

        // Create the Debt

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDebtMockMvc.perform(put("/api/debts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(debt)))
            .andExpect(status().isBadRequest());

        // Validate the Debt in the database
        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDebt() throws Exception {
        // Initialize the database
        debtRepository.saveAndFlush(debt);

        int databaseSizeBeforeDelete = debtRepository.findAll().size();

        // Delete the debt
        restDebtMockMvc.perform(delete("/api/debts/{id}", debt.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Debt> debtList = debtRepository.findAll();
        assertThat(debtList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
