<script lang="ts" setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer>
    <div>
      <h4>Footer placeholder...</h4>
      <p>
        (Placeholder...) Developed by the &#x1E34;ut&#x00ed; Geohazards Project
        in collaboration with:
      </p>
      <ul>
        <li>University of Oregon Geoscience</li>
        <li>&hellip;</li>
        <li>&hellip;</li>
        <li>University of Alaska Fairbanks</li>
      </ul>
      <p>
        (Placeholder...) Funding provided by NSF Coastlines and People Hubs for
        Research and Broadening Participation (CoPe), Award #2052972)
      </p>

      <p>
        Technology by the
        <a href="https://www.snap.uaf.edu/"
          >Scenarios Network for Alaska + Arctic Planning</a
        >
        located at the
        <a href="https://uaf-iarc.org">International Arctic Research Center</a>.
      </p>

      <p>
        Please contact
        <a href="mailto:uaf-snap-data-tools@alaska.edu"
          >uaf-snap-data-tools@alaska.edu</a
        >
        with questions or comments.
      </p>

      <p>
        Copyright &copy; {{ year }} University of Alaska Fairbanks. All rights
        reserved. The
        <a href="https://www.alaska.edu/">University of Alaska</a> is an Equal
        Opportunity/Equal Access Employer and Educational Institution. The
        University is committed to a
        <a href="https://www.alaska.edu/nondiscrimination/"
          >policy of non-discrimination</a
        >
        against individuals on the basis of any legally protected status.
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped></style>
