<template>
  <footer class="footer">
    <div class="columns">
      <div class="column is-three-fifths is-offset-one-fifth">
        <div class="content is-size-5">
          <p>
            Developed by the
            <a href="https://www.kutiproject.org"
              >&#x1E34;ut&#x00ed; Geohazards Project</a
            >
            in collaboration with the communities of Craig and Kasaan, the
            <a href="https://sitkascience.org">Sitka Sound Science Center</a>,
            the
            <a href="https://naturalsciences.uoregon.edu/earth-sciences"
              >University of Oregon Geoscience program</a
            >
            and the
            <a href="https://www.uaf.edu/">University of Alaska Fairbanks</a>.
          </p>

          <p>
            Technology by the
            <a href="https://www.snap.uaf.edu/" title="🥦🥦🥦"
              >Scenarios Network for Alaska + Arctic Planning</a
            >
            at the
            <a href="https://uaf-iarc.org"
              >International Arctic Research Center</a
            >.
          </p>

          <p>
            Funding was provided by the NSF Coastlines and People Hubs for
            Research and Broadening Participation (CoPe), Award #2052972.
          </p>

          <p>
            <strong
              >Please contact
              <a href="mailto:uaf-snap-data-tools@alaska.edu"
                >uaf-snap-data-tools@alaska.edu</a
              >
              with questions or comments.
            </strong>
            <a href="https://uaf-snap.org">Visit the SNAP website</a>
            to see all of our climate tools.
          </p>
          <p>
            UA is committed to providing accessible websites.
            <a href="https://www.alaska.edu/webaccessibility/"
              >Learn more about UA's notice of web accessibility.</a
            >
            If we can help you access this website's content,
            <a href="mailto:uaf-snap-data-tools@alaska.edu"
              >please email us at uaf-snap-data-tools@alaska.edu</a
            >.
          </p>
          <p>
            Copyright &copy; {{ year }} University of Alaska Fairbanks. All
            rights reserved.
            <br />
            The <a href="https://www.alaska.edu/">University of Alaska</a> is an
            Equal Opportunity/Equal Access Employer and Educational Institution.
            The University is committed to a
            <a href="https://www.alaska.edu/nondiscrimination/"
              >policy of non-discrimination</a
            >
            against individuals on the basis of any legally protected status.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const year = computed(() => new Date().getFullYear());
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  padding-bottom: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #dbdbdb;
  color: #5a4f72;

  img {
    width: 17rem;
  }
}
</style>
