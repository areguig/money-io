package io.github.areguig.moneyio.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import io.github.areguig.moneyio.web.rest.TestUtil;

public class DebtTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Debt.class);
        Debt debt1 = new Debt();
        debt1.setId(1L);
        Debt debt2 = new Debt();
        debt2.setId(debt1.getId());
        assertThat(debt1).isEqualTo(debt2);
        debt2.setId(2L);
        assertThat(debt1).isNotEqualTo(debt2);
        debt1.setId(null);
        assertThat(debt1).isNotEqualTo(debt2);
    }
}
