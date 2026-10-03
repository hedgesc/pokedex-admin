<template>
  <div>
    <b-row v-show="!isEditing">
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.name }}</label></b-col>
      <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;">{{ model.generation }}</label></b-col>
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.type }}</label></b-col>
      <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;">{{ model.power }}</label></b-col>
      <b-col class="text-center"><label style="padding: 0.25rem 0.5rem;">{{ model.accuracy }}</label></b-col>
      <b-col class="text-center">
        <b-form-checkbox
          style="padding: 0.25rem 0.5rem;"
          v-model="model.is_suggested"
          :disabled="isDisabled"
          @change="onIsSuggestedChange"
          switch size="lg"></b-form-checkbox>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'CharacterMove',
  props: {
    index: {
      type: Number
    },
    item: {
      type: Object
    },
    count: {
      type: Number
    }
  },
  data () {
    return {
      isEditing: false,
      model: { ...this.item }
    }
  },
  computed: {
    isDisabled () {
      if (this.count >= 4 && !this.item.is_suggested) {
        return true
      }
      return false
    }
  },
  methods: {
    onEditClick () {
      this.isEditing = true
    },
    onDeleteClick () {
      this.isEditing = false
      this.$emit('delete', { index: this.index, moveId: this.model.move_id })
    },
    onCancelClick () {
      this.isEditing = false
    },
    onSaveClick (evt) {
      this.isEditing = false
      this.$emit('update', { index: this.index, model: this.model })
    },
    onIsSuggestedChange (isSuggested) {
      const args = { id: this.model.character_move_id }

      if (isSuggested) {
        this.$emit('checked', args)
      } else {
        this.$emit('unchecked', args)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-primary {
  min-width: 50px;
}
.inline-secondary {
  min-width: 60px;
}
</style>
