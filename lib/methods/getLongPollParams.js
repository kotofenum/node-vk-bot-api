module.exports = async function() {
  if (!this.settings.group_id) {
    const result = await this.api("groups.getById", {
      access_token: this.settings.token
    });

    if (result) {
      this.settings.group_id = result.response[0].id;
    } else {
      console.error('Got no result from "groups.getById"');
      return null;
    }
  }

  const result = await this.api("groups.getLongPollServer", {
    group_id: this.settings.group_id,
    access_token: this.settings.token
  }).catch(err => {
    const { error } = JSON.parse(err);

    if (error.error_code === 15) {
      console.error(err);
      process.exit(1);
    }
  });

  return result ? result.response : null;
};
