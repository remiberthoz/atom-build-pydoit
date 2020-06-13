'use babel';

import AtomBuildPydoitView from './atom-build-pydoit-view';
import { CompositeDisposable } from 'atom';

export default {

  atomBuildPydoitView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomBuildPydoitView = new AtomBuildPydoitView(state.atomBuildPydoitViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomBuildPydoitView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-build-pydoit:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomBuildPydoitView.destroy();
  },

  serialize() {
    return {
      atomBuildPydoitViewState: this.atomBuildPydoitView.serialize()
    };
  },

  toggle() {
    console.log('AtomBuildPydoit was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
