<script>
  import { assignments } from '../stores/stores';

  let maxPoints = 0;
  let points = 0;

  $: {
    maxPoints = $assignments.length * 100;
    points =
      $assignments.filter((assignment) => assignment.completed).length * 100;
  }
</script>

<span id="assignment-points" class="text-blue-300">
  {points} / {maxPoints}
</span>
